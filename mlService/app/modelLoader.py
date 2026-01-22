from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

MODEL = "./fakeNewsModel"

tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()
