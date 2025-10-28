import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset 
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns
import os

class FakeNewsDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, maxLength=512):
        self.texts = texts.reset_index(drop=True)
        self.labels = labels.rest_index(drop=True)
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
                max_length=self.max_length,
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

def plotConfusionMatrix(yTrue, yPred, outputPath='./confusion_matrix.png'):
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
    print(f'Confusion matrix saved to {outputPath}')
    plt.close()






