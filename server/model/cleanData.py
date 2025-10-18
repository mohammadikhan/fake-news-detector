import pandas as pd
import re
import nltk
import glob
import os
from bs4 import BeautifulSoup
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
from nltk.corpus import stopwords
nltk.download('stopwords')

stopWords = set(stopwords.words('english'))

def cleanData(text):
    if pd.isnull(text):
        return ""
    
    text = BeautifulSoup(text, "html.parser").get_text()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^A-Za-z0-9(),!?\"'`\n]", " ", text) 
    text = re.sub(r"\s+", " ", text).strip()
    text = " ".join([word for word in text.split() if word.lower() not in stopWords])
    return text

def kaggleNewsData():
    realNews = pd.read_csv("../data/kaggle/True.csv")
    fakeNews = pd.read_csv("../data/kaggle/Fake.csv")

    realNews["label"] = 1
    fakeNews["label"] = 0
    df = pd.concat([realNews, fakeNews])

    df["text"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["text"] = df["text"].apply(cleanData)

    return df[["text", "label"]]

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
            "half-true": 1,
            "barely-true": 0,
            "false": 0,
            "pants-fire": 0
        }
        
        df["text"] = df["text"].apply(cleanData)
        df["label"] = df["label"].map(mappedLabel)
        allData.append(df)

    return pd.concat(allData)
        

def welfakeData():
    df = pd.read_parquet("hf://datasets/davanstrien/WELFake/data/train-00000-of-00001-290868f0a36350c5.parquet")

    if "title" in df.columns:
        df["text"] = df["title"].fillna("") + " " + df["text"].fillna("")

    df["text"] = df["text"].apply(cleanData)

    return df[["text", "label"]]

def dataCombineAndSplit():
    
    # Load datasets
    kaggleDf = kaggleNewsData()
    liarDf = liarData()
    welfakeDataDf = welfakeData()

    # Combine the datasets
    combinedData = pd.concat([kaggleDf, liarDf, welfakeDataDf], ignore_index=True)
    combinedData = combinedData.dropna(subset=['text', 'label'])
    combinedData = combinedData[combinedData['text'].str.strip() != '']

    print(f"Combined dataset: {len(combinedData)} samples")
    print(f"Label distribution:\n{combinedData['label'].value_counts()}")

    combinedData = shuffle(combinedData, random_state=42).reset_index(drop=True)

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
    
    # Check label distribution in each set
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
