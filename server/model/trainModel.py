import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset 
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns
import os
os.environ['WANDB_DISABLED'] = 'false'

class FakeNewsDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, maxLength=512):
        self.texts = texts.reset_index(drop=True)
        self.labels = labels.reset_index(drop=True)
        self.tokenizer = tokenizer
        self.maxLength = maxLength

    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts.iloc[idx])
        label = self.labels.iloc[idx]

        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.maxLength,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }


# Load processed data
def loadProcessedData():
    trainDf = pd.read_csv("../data/processed/train.csv")
    valDf = pd.read_csv("../data/processed/validation.csv")
    testDf = pd.read_csv("../data/processed/test.csv")
    return trainDf, valDf, testDf

def computeMetrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)

    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='weighted')
    acc = accuracy_score(labels, preds)

    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def plotConfusionMatrix(yTrue, yPred, outputPath='./confusionMatrix.png'):
    cm = confusion_matrix(yTrue, yPred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Fake(0)', 'Real(1)'], yticklabels=['Fake(0)', 'Real(1)'], cbar_kws={'label': 'Count'})
    
    plt.title('Confusion Matrix - Fake News Detection', fontsize=16, fontweight='bold')
    plt.ylabel('Actual', fontsize=12)
    plt.xlabel('Predicted', fontsize=12)

    total = cm.sum()
    for i in range(2):
        for j in range(2):
            percentage = (cm[i, j] / total) * 100
            plt.text(j + 0.5, i + 0.7, f'\n{percentage:.1f}%', ha='center', va='center', fontsize=10, color='gray')

    plt.tight_layout()
    plt.savefig(outputPath, dpi=300, bbox_inches='tight')
    print(f'[SUCCESS]: Confusion matrix saved to {outputPath}')
    plt.close()

    return cm

def trainModel():
   
    print("Loading processed data...")
    trainDf, valDf, testDf = loadProcessedData()
    print(f"Train samples: {len(trainDf)}, Validation samples: {len(valDf)}, Test samples: {len(testDf)}")

    print("Loading model")
    modelName = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(modelName)
    model = AutoModelForSequenceClassification.from_pretrained(modelName, num_labels=2)

    print("Preparing datasets...")
    trainDataset = FakeNewsDataset(
        texts=trainDf['text'],
        labels=trainDf['label'],
        tokenizer=tokenizer
    )

    valDataset = FakeNewsDataset(
        texts=valDf['text'],
        labels=valDf['label'],
        tokenizer=tokenizer
    )

    trainingArgs = TrainingArguments(
        output_dir='./fakeNewsModel',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        eval_strategy='epoch',
        save_strategy='epoch',
        load_best_model_at_end=True,
    )

    trainer = Trainer(
        model=model,
        args=trainingArgs,
        train_dataset=trainDataset,
        eval_dataset=valDataset,
        compute_metrics=computeMetrics,
    )

    # Training the model
    print("Starting training...")
    trainer.train()

    print("Evaluating model on test set...")
    testDataset = FakeNewsDataset(
        texts=testDf['text'],
        labels=testDf['label'],
        tokenizer=tokenizer
    )

    predictions = trainer.predict(testDataset)
    yPred = predictions.predictions.argmax(-1)
    yTrue = testDf['label'].values

    accuracy = accuracy_score(yTrue, yPred)
    precision, recall, f1, _ = precision_recall_fscore_support(yTrue, yPred, average='weighted')

    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Test Precision: {precision:.4f}")
    print(f"Test Recall: {recall:.4f}")
    print(f"Test F1-Score: {f1:.4f}")

    print("Plotting confusion matrix...")
    cm = plotConfusionMatrix(yTrue, yPred, outputPath='./confusion_matrix.png')

    print("\nClassification Report:")
    print(classification_report(yTrue, yPred, target_names=['Fake (0)', 'Real (1)'], digits=4))

    misclassifiedIndices = np.where(yTrue != yPred)[0]
    print(f"Number of misclassified samples: {len(misclassifiedIndices)} out of {len(yTrue)} ({(len(misclassifiedIndices)/len(yTrue))*100:.2f}%)")
    
    if len(misclassifiedIndices) > 0:
        print("Some misclassified samples:")
        for i, idx in enumerate(misclassifiedIndices[:3], 1):
            textPreview = testDf.iloc[idx]['text'][:150] + "..."
            trueLabel = "Real" if yTrue[idx] == 1 else "Fake"
            predLabel = "Real" if yPred[idx] == 1 else "Fake"
            print(f"\n{i}. True Label: {trueLabel}, Predicted Label: {predLabel}\n")
            print(f"   Text Preview: {textPreview}\n")
    
    print("------------------------")

    model.save_pretrained('./fakeNewsModel')
    tokenizer.save_pretrained('./fakeNewsModel')
    print("[SUCCESS] Model and tokenizer saved to './fakeNewsModel'")

    
    return trainer

if __name__ == "__main__":
    trainer = trainModel()
