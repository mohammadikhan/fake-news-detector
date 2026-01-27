import numpy as np
import torch
import re
from lime.lime_text import LimeTextExplainer
from typing import Dict, List
from app.modelLoader import model, tokenizer, device
from app.config import (MAX_TOKENS, MAX_SAMPLES, DEFAULT_FEATURES)

limeExplainer = LimeTextExplainer(
    class_names=["FAKE", "REAL"],
    split_expression=r"\W+",
    bow=False
)

def validToken(word: str) -> bool:
    
    if len(word) < 3:
        return False

    if word.isdigit():
        return False
    
    if re.fullmatch(r"\W+", word):
        return False
    
    return True

def predictProbabilities(texts: List[str]) -> np.ndarray:
    probabilities = []
    batchSize = 32

    for i in range(0, len(texts), batchSize):
        batchTexts = texts[i:i + batchSize]
        
        inputs = tokenizer(
            batchTexts,
            truncation=True,
            padding=True,
            max_length=MAX_TOKENS,
            return_tensors="pt"
        )

        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)
            probabilities.extend(probs.cpu().numpy())
    
    return np.array(probabilities)

def analyzeTextPatterns(text: str) -> Dict:

    textLower = text.lower()

    patterns = {
        'emotional': [],
        'professional': [],
        'sensational': [],
        'specificity': {},
        'sourcing': {'credible': [], 'vague': []}
    }

    # Find words that sound emotional
    emotionalWords = ['outraged', 'furious', 'warning', 'danger', 'threatened', 'furious', 'horrified', 'devastated', 'must', 'urgent']
    patterns['emotional'] = [word for word in emotionalWords if word in textLower]

    # Find words that sound professional and credible
    professionalWords = ['analysis', 'data', 'research', 'study', 'studies', 'statistics', 'investigation', 'administration', 'officials', 'department']
    patterns['professional'] = [word for word in professionalWords if word in textLower]

    # Find words that sound sensational
    sensationalWords = ['breaking', 'shocking', 'just in', 'must see', 'stunned', 'exposed', 'unbelievable', 'incredible', 'amazing', 'revealed']
    patterns['sensational'] = [word for word in sensationalWords if word in textLower]

    # Find words that have some specificity (like specific dates, quotes, numbers etc.)
    hasDates = bool(re.search(r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|'
                                   r'january|february|march|april|may|june|july|august|'
                                   r'september|october|november|december|\d{1,2}/\d{1,2}(/\d{2,4})?)\b', textLower))
    
    hasNumbers = bool(re.search(r'\b\d+(\.\d+)?%?\b', text))
    hasQuotes = '"' in text
    hasProperNouns = bool(re.search(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text))
    patterns['specificity'] = {
        'dates': hasDates,
        'numbers': hasNumbers,
        'quotes': hasQuotes,
        'properNouns' : hasProperNouns
    }

    # Finding words/phrases that match credible and vague sorucing
    credibleWords = ['according to', 'announced', 'stated', 'reported', 'confirmed', 'official', 'said', 'confirms', 'press release']
    vagueWords = ['allegedly', 'insiders', 'claims', 'claimed', 'it is believed', 'rumours', 'rumor', 'some say']

    patterns['sourcing']['credible'] = [sourcePhrase for sourcePhrase in credibleWords if sourcePhrase in textLower]
    patterns['sourcing']['vague'] = [sourcePhrase for sourcePhrase in vagueWords if sourcePhrase in textLower]

    return patterns

def generateHumanExplanation(prediction: str, confidence: float, realIndicators: List[Dict], fakeIndicators: List[Dict], patterns: Dict) -> str:

    # Generate a human readable explanation to explain why the model predicted the news article the way it did

    explanation = f"Analysis Summary\n\n"
    explanation += f"The model predicted this article as **{prediction}** with **{confidence * 100:.1f}% confidence**.\n\n"

    if prediction == "REAL" and realIndicators:
        words = ', '.join([f"**{word['word']}**" for word in realIndicators[:3]])
        explanation += f"The predicition was mainly influenced by the following words: {words}.\n\n"
    elif prediction == "FAKE" and fakeIndicators:
        words = ', '.join([f"**{word['word']}**" for word in fakeIndicators[:3]])
        explanation += f"The predicition was mainly influenced by the following words: {words}.\n\n"
    
    explanation += "\n\n"

    if prediction == "FAKE":
        explanation += "### Why This Article Was Flagged as FAKE:\n\n"

        reasons = []

        if patterns['emotional']:
            explanation += "**Emotional Language**\n\n"
            explanation += f"Emotional trigger words were detected like *{', '.join(patterns['emotional'][:3])}*\n\n"
            explanation += "These words trigger strong emotional responses that bypass critical thinking. "
            explanation += "Professional/Factual reporting presents information in such a way that does not trigger an emotional response.\n\n"
            reasons.append("Emotional Manipulation")
        
        if patterns['sensational']:
            explanation += "**Sensational Language**\n\n"
            explanation += f"The article makes use of attention-grabbing words such as: *{', '.join(patterns['sensational'][:3])}*\n\n"
            explanation += "Credible news reports generally avoid sensational words to maintain a professional, factual tone. "
            explanation += "Such words attempt to provoke an emotional reaction rather than be informational.\n\n"
            reasons.append("Sensational")
        
        if patterns['sourcing']['vague']:
            explanation += "**Vague sourcing**\n\n"
            explanation += f"The article continaed phrases like: *{', '.join(patterns['sourcing']['vague'][:3])}*\n\n"
            explanation += "Legitimate news articles cite reputable sources with names, titles etc. "
            explanation += "Referencing vague sources like 'insiders' and 'rumours' are persistent in misinformation.\n\n"
            reasons.append("Vague Sourcing")
        
        specificFlags = ['dates', 'properNouns', 'quotes']
        missingAny = any(not patterns['specificity'][k] for k in specificFlags)

        if missingAny:
            explanation += "**Lack of Specific Details**\n\n"

            if not patterns['specificity']['dates']:
                explanation += "- No specific dates were mentioned\n"
            if not patterns['specificity']['properNouns']:
                explanation += "- Limited references to specific individuals or places\n"
            if not patterns['specificity']['quotes']:
                explanation += "- No direct quotes from specific individuals were referenced\n"
            
            explanation += "Real News Articles include verifiable details that can be fact-checked by readers.\n\n"
            reasons.append("Lack of Specificity")

        if not reasons:
            explanation += "The model detected lingustic patterns that are commonly associated with misinformation. This suggets patterns in word choice and sentence structure that differ from reputable journalism.\n\n"


        explanation += "### What Makes an Article Credible:\n\n"
        explanation += "- Name specific sources linked to real organizations\n"
        explanation += "- Include dates, times and locations that can be verified\n"
        explanation += "- Use direct quotes from individuals named in the article\n"
        explanation += "- Use professional, neutral tone instead of using sensational and emotional language\n"
    
    else:
        explanation += "### Why This Article Was Flagged as REAL:\n\n"

        credibleReasons = []

        if patterns['professional']:
            explanation += "**Professional Language**\n\n"
            explanation += f"The Article makes use of terminology associated with credible reporting such as: *{', '.join(patterns['professional'][:3])}*\n\n"
            explanation += "The tone of the articles suggests that it makes use of official sources and research instead of speculation or personal opinions.\n\n"
            credibleReasons.append("Professional Tone")
        
        if not patterns['emotional'] and not patterns['sensational']:
            explanation += "**Factual and Neutral Tone**\n\n"
            explanation += "The article avoids emotional manipulation and sensational phrases. "
            explanation += "Information is presented in a straightforward manner that is consistent with professional journalism standards.\n\n"
            credibleReasons.append("Factual and Neutral")
        
        
        specific = {
            'dates': "Contains specific dates and timeframes",
            'numbers': "Includes verifiable statistics",
            'quoutes': "Contains direct quotes from specific individuals that were referenced in the article",
            'properNouns': "Article names specific individuals or places"
        }
        
        foundSpecific = [text for key, text in specific.items() if patterns['specificity'].get(key)]
        
        if foundSpecific:
            explanation += "**Verifiable, Legitimate and Specific Information**\n\n"
            explanation += "\n".join(f"- {item}" for item in foundSpecific)
            explanation += "\n\nThese details can be verified independently, which strengthens credibility.\n\n"
            credibleReasons.append("Verifiable and Specific Information")

        if patterns['sourcing']['credible']:
            explanation += "**Credible and Professional Sourcing**\n\n"
            explanation += f"The article makes use of phrases linked to credible sourcing such as: *{', '.join(patterns['sourcing']['credible'][:3])}*\n\n"
            explanation += "Using such phrases suggests that the information was obtained through specific sources, indicating that this is professional journalism.\n\n"
            credibleReasons.append("Credible Sourcing")

        if not credibleReasons:
            explanation += "While no clear red flags were detected, the model identified certain patterns in language, paragraph structure and words that align with credible, professional journalism.\n\n"
        
        explanation += "### NOTE:\n\n"
        explanation += "Articles predicited as REAL should still be cross-referenced with other sources. This prediction suggests that the article follows professional journalism/news reporting standards, but this doesn't guarantee that everything presented is accurate.\n"
    
    return explanation

def analyze(text: str, numFeatures: int = DEFAULT_FEATURES, numSamples: int = MAX_SAMPLES, includeExplanation: bool = False) -> Dict:
    
    actualProbability = predictProbabilities([text])[0]
    actualPredicion = 1 if actualProbability[1] > actualProbability[0] else 0
    predictionLabel = "REAL" if actualPredicion == 1 else "FAKE"
    confidence = actualProbability[actualPredicion]
    
    exp = limeExplainer.explain_instance(
        text,
        predictProbabilities,
        num_features=numFeatures,
        num_samples=numSamples,
        labels=(0, 1)
    )

    features = exp.as_list(label=actualPredicion)
    fakeIndicators = []
    realIndicators = []

    for word, weight in features:

        word = str(word)

        if not validToken(word):
            continue

        feature = {
            'word': word,
            'weight': float(abs(weight))
        }

        if actualPredicion == 0:
            if weight > 0:
                fakeIndicators.append(feature)
            else:
                realIndicators.append(feature)
        else:
            if weight > 0:
                realIndicators.append(feature)
            else:
                fakeIndicators.append(feature)
    
    fakeIndicators = sorted(fakeIndicators, key=lambda x: x['weight'], reverse=True)
    realIndicators = sorted(realIndicators, key=lambda x: x['weight'], reverse=True)

    # topIndicators = fakeIndicators if actualPredicion == 0 else realIndicators
    patterns = analyzeTextPatterns(text)

    humanReadableExplanation = generateHumanExplanation(
        predictionLabel,
        confidence,
        realIndicators,
        fakeIndicators,
        patterns
    )

    explanationResponse = {
        "prediction": predictionLabel,
        "confidence": confidence,
        "probabilities": {
            "fake": float(actualProbability[0]),
            "real": float(actualProbability[1])
        }
    }

    if includeExplanation:
        explanationResponse["explainability"] = {
            "topFakeIndicators": [fake["word"] for fake in fakeIndicators[:5]],
            "topRealIndicators": [real["word"] for real in realIndicators[:5]],
            "interpretation": humanReadableExplanation
        }

    return explanationResponse
