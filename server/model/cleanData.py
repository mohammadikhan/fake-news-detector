import pandas as pd
import re
import glob
import os
from bs4 import BeautifulSoup
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split


def cleanData(text):
    if pd.isnull(text):
        return ""
    
    # Remove HTML tags
    text = BeautifulSoup(text, "html.parser").get_text()

    # Remove URLs
    text = re.sub(r"http\S+|www\.\S+", "", text)

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)

    return text.strip()

def removeTags(text):
    return re.sub(r'^.*?\s?\(Reuters\)\s?-\s?', '', str(text))

def liarData():
    liarDataset = "../data/liar/"
    allData = []

    for file in glob.glob(f"{liarDataset}/*.tsv"):
        df = pd.read_csv(file, sep="\t", header=None)
        df = df[[2, 1]]
        df.columns = ["text", "label"]

        mappedLabel = {
            "true": 1,
            "mostly-true": 1,
            "half-true": None,
            "barely-true": 0,
            "false": 0,
            "pants-fire": 0
        }
        
        df["label"] = df["label"].map(mappedLabel)
        df = df.dropna(subset=["label"])
        df["text"] = df["text"].apply(cleanData)
        df = df[df["text"].str.strip().str.len() > 5]

        allData.append(df)

    return pd.concat(allData, ignore_index=True)
        

def welfakeData():
    df = pd.read_parquet("hf://datasets/davanstrien/WELFake/data/train-00000-of-00001-290868f0a36350c5.parquet")

    # Flip labelling so that 1 = Real and 0 = Fake
    df['label'] = df['label'].map({0: 1, 1: 0})

    if "title" in df.columns:
        df["text"] = (df["title"].fillna("").astype(str) + ". " + df["text"].fillna("").astype(str))

    df["text"] = df["text"].apply(removeTags)
    df["text"] = df["text"].apply(cleanData)

    df = df[df["text"].str.strip().str.len() >= 10]

    return df[["text", "label"]]

def dataCombineAndSplit():
    
    # Load datasets
    liarDf = liarData()
    welfakeDataDf = welfakeData()

    # Combine the datasets
    combinedData = pd.concat([liarDf, welfakeDataDf], ignore_index=True)
    combinedData = combinedData.dropna(subset=['text', 'label'])

    # Remove duplicates
    combinedData = combinedData.drop_duplicates(subset=['text'], keep='first')

    # Convert labels to integers
    combinedData['label'] = combinedData['label'].astype(int)

    print(f"Combined dataset: {len(combinedData)} samples")
    print(f"Label distribution:\n{combinedData['label'].value_counts()}")

    combinedData = shuffle(combinedData, random_state=42).reset_index(drop=True)

    combinedData['text_length'] = combinedData['text'].str.split().str.len()
    print(f"Text length statistics:")
    print(combinedData['text_length'].describe())

    maxLength = combinedData['text_length'].quantile(0.99)
    print(f"Removing texts longer than {maxLength} words")
    combinedData = combinedData[combinedData['text_length'] <= maxLength]
    combinedData = combinedData.drop('text_length', axis=1)

    # Split Data
    X = combinedData['text']
    y = combinedData['label']

    # Split data into test set (10%)
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y,
        test_size = 0.10,
        random_state=42,
        stratify=y
    )

    # Split remaining data into train (80%) and validation (10%)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp,
        test_size = 0.111,
        random_state=42,
        stratify=y_temp
    )

    print(f"\nDataset splits:")
    print(f"Training set: {len(X_train)} samples ({len(X_train)/len(combinedData)*100:.1f}%)")
    print(f"Validation set: {len(X_val)} samples ({len(X_val)/len(combinedData)*100:.1f}%)")
    print(f"Test set: {len(X_test)} samples ({len(X_test)/len(combinedData)*100:.1f}%)")
    
    # Checking label distribution in each set
    print(f"\nLabel distribution in training set: ")
    print(f"Real news (1): {sum(y_train)} ({sum(y_train)/len(y_train)*100:.1f}%)")
    print(f"Fake news (0): {len(y_train) - sum(y_train)} ({(len(y_train) - sum(y_train))/len(y_train)*100:.1f}%)")
    
    print(f"\nLabel distribution in validation set: ")
    print(f"Real news (1): {sum(y_val)} ({sum(y_val)/len(y_val)*100:.1f}%)")
    print(f"Fake news (0): {len(y_val) - sum(y_val)} ({(len(y_val) - sum(y_val))/len(y_val)*100:.1f}%)")
    
    print(f"\nLabel distribution in test set: ")
    print(f"Real news (1): {sum(y_test)} ({sum(y_test)/len(y_test)*100:.1f}%)")
    print(f"Fake news (0): {len(y_test) - sum(y_test)} ({(len(y_test) - sum(y_test))/len(y_test)*100:.1f}%)")

    return X_train, X_val, X_test, y_train, y_val, y_test

def saveSplits(X_train, X_val, X_test, y_train, y_val, y_test, outputDir="../data/processed"):
    
    os.makedirs(outputDir, exist_ok=True)

    trainDf = pd.DataFrame({'text': X_train, 'label': y_train})
    valDf = pd.DataFrame({'text': X_val, 'label': y_val})
    testDf = pd.DataFrame({'text': X_test, 'label': y_test})

    trainDf.to_csv(f"{outputDir}/train.csv", index=False)
    valDf.to_csv(f"{outputDir}/validation.csv", index=False)
    testDf.to_csv(f"{outputDir}/test.csv", index=False)

    print(f"\nData splits saved to {outputDir}")
    print(f"- train.csv: {len(trainDf)} samples")
    print(f"- validation.csv: {len(valDf)} samples")
    print(f"- test.csv: {len(testDf)} samples")

def main():
    
    print("Step 1: Load, clean and combine data...")
    X_train, X_val, X_test, y_train, y_val, y_test = dataCombineAndSplit()

    print("\nStep 2: Save data splits...")
    saveSplits(X_train, X_val, X_test, y_train, y_val, y_test)

    print("\nStep 3: Data verification...")
    print(f"Sample from training set:")
    print(f"Text: {X_train.iloc[0][:200]}...")
    print(f"Label: {y_train.iloc[0]} ({'Real' if y_train.iloc[0] == 1 else 'Fake'} news)")

    print("Model ready for training!")

    return X_train, X_val, X_test, y_train, y_val, y_test

if __name__=="__main__":
    main()
