/**
 * FeedSense AI Engine v2.0
 * Advanced NLP & ML algorithms running in-browser (JavaScript)
 * Features: Emotion Detection, Aspect-Based Sentiment, Spam Detection,
 *           Urgency Detection, Duplicate Detection, Topic Modeling,
 *           Multilingual (Hindi/Hinglish), AI Summarizer, Recommendation Engine
 */

// ─── Multilingual Dictionaries ───────────────────────────────────────────────

const HINGLISH_POSITIVE = [
  'accha', 'achha', 'badhiya', 'zabardast', 'mast', 'shandar', 'lajawab',
  'behtareen', 'best', 'superb', 'ekdum', 'maza', 'khushi', 'pasand',
  'helpful', 'samjhaya', 'samajh', 'aaya', 'clear', 'padhaya',
];

const HINGLISH_NEGATIVE = [
  'bakwas', 'kharab', 'boring', 'bekar', 'faltu', 'bura', 'nahi',
  'samjha', 'nahi aaya', 'mushkil', 'dikkat', 'problem', 'sad',
  'galat', 'slow', 'late', 'absent', 'padhai nahi', 'kuch nahi',
];

const HINDI_POSITIVE = [
  'अच्छा', 'बढ़िया', 'शानदार', 'उत्कृष्ट', 'सहायक', 'स्पष्ट', 'समझदार',
];

const HINDI_NEGATIVE = [
  'बुरा', 'खराब', 'बोरिंग', 'बेकार', 'मुश्किल', 'समझ नहीं', 'धीमा',
];

// ─── Emotion Lexicon ─────────────────────────────────────────────────────────

const EMOTION_LEXICON = {
  joy: [
    'excellent', 'amazing', 'fantastic', 'wonderful', 'love', 'great', 'best',
    'happy', 'enjoyable', 'fun', 'exciting', 'brilliant', 'superb', 'glad',
    'satisfied', 'pleased', 'impressed', 'awesome', 'perfect', 'mast', 'badhiya',
  ],
  satisfaction: [
    'good', 'helpful', 'clear', 'organized', 'professional', 'knowledgeable',
    'effective', 'thorough', 'productive', 'interesting', 'engaging', 'supportive',
    'patient', 'understanding', 'responsive', 'available', 'punctual',
  ],
  frustration: [
    'confused', 'confusing', 'unclear', 'difficult', 'hard', 'struggle',
    'lost', 'frustrating', 'disappointed', 'annoying', 'tedious', 'boring',
    'monotonous', 'slow', 'fast', 'rush', 'bakwas', 'bekar',
  ],
  anger: [
    'terrible', 'awful', 'worst', 'horrible', 'useless', 'waste', 'rude',
    'disrespectful', 'unfair', 'pathetic', 'disgusting', 'hate', 'angry',
    'furious', 'outrageous', 'unacceptable', 'failed', 'incompetent',
  ],
  sadness: [
    'sad', 'unhappy', 'disappointment', 'unfortunate', 'regret', 'sorry',
    'missing', 'incomplete', 'lacking', 'below', 'inadequate', 'poor',
    'weak', 'struggle', 'fail', 'low', 'depressing',
  ],
};

// ─── Aspect Keywords ─────────────────────────────────────────────────────────

const ASPECT_KEYWORDS = {
  teaching: [
    'teach', 'teaching', 'explain', 'explanation', 'lecture', 'class',
    'concept', 'topic', 'lesson', 'course', 'instruction', 'methodology',
    'presentation', 'clarity', 'understanding', 'knowledge', 'expertise',
  ],
  faculty: [
    'teacher', 'professor', 'faculty', 'sir', 'mam', 'madam', 'instructor',
    'mentor', 'guide', 'tutor', 'prof', 'dr', 'available', 'helpful',
    'interaction', 'communication', 'punctual', 'regular', 'attendance',
  ],
  labs: [
    'lab', 'laboratory', 'practical', 'experiment', 'equipment', 'computer',
    'machine', 'system', 'working', 'hardware', 'software', 'tools',
    'hands-on', 'practice', 'coding',
  ],
  curriculum: [
    'syllabus', 'curriculum', 'content', 'material', 'book', 'notes',
    'assignment', 'homework', 'project', 'exam', 'test', 'marks',
    'grading', 'evaluation', 'assessment', 'weightage', 'coverage',
  ],
  infrastructure: [
    'wifi', 'wi-fi', 'internet', 'library', 'canteen', 'hostel', 'room',
    'classroom', 'seat', 'ac', 'fan', 'projector', 'board', 'chalk',
    'facility', 'campus', 'building', 'toilet', 'washroom', 'parking',
  ],
  support: [
    'doubt', 'question', 'help', 'support', 'guidance', 'feedback',
    'response', 'reply', 'available', 'office', 'hours', 'extra', 'class',
    'tutorial', 'doubt session', 'query', 'clearing',
  ],
};

// ─── Spam Indicators ─────────────────────────────────────────────────────────

const SPAM_PATTERNS = [
  /^[a-z]{1,3}$/i,                           // too short
  /^(.)\1+$/,                                  // repeated character
  /^(na|no|ok|yes|fine|good|bad)\.?$/i,       // single word non-feedback
  /^\d+$/,                                     // only numbers
  /^[^a-zA-Z]*$/,                             // no letters
];

const SPAM_INDICATORS = [
  'asdf', 'qwerty', 'xyz', 'abc', 'test', 'testing', 'dummy', 'sample',
  'nothing', 'idk', 'dont know', 'no comment', 'n/a', 'na', 'nil',
];

// ─── Urgency Keywords ────────────────────────────────────────────────────────

const URGENCY_HIGH = [
  'urgent', 'immediately', 'must', 'critical', 'serious', 'dangerous',
  'harass', 'harassment', 'abuse', 'threat', 'bribe', 'corrupt',
  'discriminat', 'fail', 'failing', 'mental health', 'depression',
  'anxiety', 'stress', 'breakdown', 'emergency',
];

const URGENCY_MEDIUM = [
  'problem', 'issue', 'complaint', 'wrong', 'unfair', 'bias', 'biased',
  'not attending', 'absent', 'never comes', 'no class', 'skip',
  'incomplete syllabus', 'not taught', 'waste of time',
];

// ─── Topic Seeds ─────────────────────────────────────────────────────────────

const TOPIC_SEEDS = {
  'Teaching Quality': ['teach', 'explain', 'clear', 'concept', 'understand', 'lecture', 'methodology'],
  'Faculty Behavior': ['teacher', 'faculty', 'professor', 'rude', 'helpful', 'punctual', 'friendly'],
  'Course Content': ['syllabus', 'content', 'material', 'notes', 'book', 'assignment', 'project'],
  'Lab & Practicals': ['lab', 'practical', 'experiment', 'equipment', 'computer', 'coding'],
  'Infrastructure': ['wifi', 'library', 'canteen', 'classroom', 'facility', 'campus'],
  'Assessment & Grading': ['exam', 'test', 'marks', 'grade', 'evaluation', 'assessment', 'quiz'],
  'Student Support': ['doubt', 'help', 'support', 'guidance', 'available', 'response', 'extra'],
  'Overall Experience': ['overall', 'experience', 'general', 'semester', 'course', 'satisfied'],
};

// ─── Core Utility Functions ───────────────────────────────────────────────────

function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 1);
}

function getWordFrequency(tokens) {
  const freq = {};
  tokens.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return freq;
}

function cosineSimilarity(freq1, freq2) {
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  let dot = 0, mag1 = 0, mag2 = 0;
  for (const w of allWords) {
    const a = freq1[w] || 0;
    const b = freq2[w] || 0;
    dot += a * b;
    mag1 += a * a;
    mag2 += b * b;
  }
  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function jaccardSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// ─── 1. Emotion Detection ────────────────────────────────────────────────────

/**
 * Detects the dominant emotion in feedback text.
 * Returns: { dominant, emotions: { joy, satisfaction, frustration, anger, sadness }, confidence }
 */
export function detectEmotion(text) {
  const tokens = tokenize(text);
  const scores = {};

  for (const [emotion, words] of Object.entries(EMOTION_LEXICON)) {
    let score = 0;
    for (const token of tokens) {
      if (words.some(w => token.includes(w) || w.includes(token))) score++;
    }
    scores[emotion] = score;
  }

  // Add Hinglish/Hindi boosts
  const lowerText = text.toLowerCase();
  HINGLISH_POSITIVE.forEach(w => { if (lowerText.includes(w)) scores.joy = (scores.joy || 0) + 1; });
  HINGLISH_NEGATIVE.forEach(w => { if (lowerText.includes(w)) scores.frustration = (scores.frustration || 0) + 1; });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  if (totalScore === 0) {
    return { dominant: 'neutral', emotions: { joy: 0, satisfaction: 0, frustration: 0, anger: 0, sadness: 0 }, confidence: 40 };
  }

  // Normalize to percentages
  const normalized = {};
  for (const [k, v] of Object.entries(scores)) {
    normalized[k] = Math.round((v / totalScore) * 100);
  }

  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const confidence = Math.min(90, 45 + totalScore * 8);

  return { dominant, emotions: normalized, confidence: Math.round(confidence) };
}

// ─── 2. Aspect-Based Sentiment Analysis ─────────────────────────────────────

const POSITIVE_WORDS = [
  'excellent', 'outstanding', 'amazing', 'fantastic', 'wonderful', 'great', 'good',
  'helpful', 'clear', 'effective', 'knowledgeable', 'engaging', 'organized', 'professional',
  'best', 'love', 'enjoyed', 'learned', 'improved', 'brilliant', 'superb', 'perfect',
  'satisfied', 'happy', 'positive', 'productive', 'interesting', 'punctual', 'regular',
  ...HINGLISH_POSITIVE,
];

const NEGATIVE_WORDS = [
  'bad', 'poor', 'terrible', 'awful', 'worst', 'boring', 'confusing', 'unclear',
  'difficult', 'unhelpful', 'unprepared', 'disorganized', 'late', 'absent', 'rude',
  'monotonous', 'ineffective', 'disappointing', 'frustrated', 'lost', 'failed',
  'waste', 'irrelevant', 'slow', 'useless', 'incomplete', 'dissatisfied',
  ...HINGLISH_NEGATIVE,
];

const NEGATION_WORDS = ['not', 'no', 'never', 'neither', 'hardly', "don't", "doesn't", "didn't", "wasn't", "isn't"];

/**
 * Performs aspect-based sentiment analysis.
 * Returns: { aspects: { teaching, faculty, labs, curriculum, infrastructure, support } }
 * Each aspect has: { sentiment, score, mentions }
 */
export function analyzeAspects(text) {
  const tokens = tokenize(text);
  const result = {};

  for (const [aspect, keywords] of Object.entries(ASPECT_KEYWORDS)) {
    let posScore = 0, negScore = 0, mentions = 0;

    // Find aspect mentions and surrounding sentiment
    for (let i = 0; i < tokens.length; i++) {
      const isAspect = keywords.some(k => tokens[i].includes(k) || k.includes(tokens[i]));
      if (!isAspect) continue;
      mentions++;

      // Check window of -3 to +5 words around aspect
      for (let j = Math.max(0, i - 3); j <= Math.min(tokens.length - 1, i + 5); j++) {
        const word = tokens[j];
        const prevWord = j > 0 ? tokens[j - 1] : '';
        const isNegated = NEGATION_WORDS.includes(prevWord);

        if (POSITIVE_WORDS.includes(word)) {
          isNegated ? negScore++ : posScore++;
        } else if (NEGATIVE_WORDS.includes(word)) {
          isNegated ? posScore++ : negScore++;
        }
      }
    }

    if (mentions === 0) continue;

    const total = posScore + negScore || 1;
    const sentiment = posScore > negScore ? 'positive' : negScore > posScore ? 'negative' : 'neutral';
    const score = (posScore - negScore) / total;

    result[aspect] = {
      sentiment,
      score: Math.round(score * 100) / 100,
      mentions,
      positiveScore: posScore,
      negativeScore: negScore,
    };
  }

  return { aspects: result };
}

/**
 * Aggregate aspect analysis across multiple feedbacks
 */
export function aggregateAspects(feedbacks) {
  const combined = {};

  feedbacks.forEach(fb => {
    const text = fb.comment || fb.text || '';
    const { aspects } = analyzeAspects(text);

    for (const [aspect, data] of Object.entries(aspects)) {
      if (!combined[aspect]) {
        combined[aspect] = { totalMentions: 0, posScore: 0, negScore: 0, feedbacks: 0 };
      }
      combined[aspect].totalMentions += data.mentions;
      combined[aspect].posScore += data.positiveScore;
      combined[aspect].negScore += data.negativeScore;
      combined[aspect].feedbacks++;
    }
  });

  const result = {};
  for (const [aspect, data] of Object.entries(combined)) {
    const total = data.posScore + data.negScore || 1;
    result[aspect] = {
      sentiment: data.posScore > data.negScore ? 'positive' : data.negScore > data.posScore ? 'negative' : 'neutral',
      score: Math.round(((data.posScore - data.negScore) / total) * 100),
      mentions: data.totalMentions,
      feedbacks: data.feedbacks,
    };
  }

  return result;
}

// ─── 3. Spam Detection ───────────────────────────────────────────────────────

/**
 * Detects if feedback is spam/irrelevant.
 * Returns: { isSpam, confidence, reason }
 */
export function detectSpam(text) {
  if (!text || text.trim().length === 0) {
    return { isSpam: true, confidence: 99, reason: 'Empty feedback' };
  }

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  const lowerText = trimmed.toLowerCase();

  // Pattern-based detection
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isSpam: true, confidence: 90, reason: 'Too short or non-informative' };
    }
  }

  // Too short
  if (words.length < 3) {
    return { isSpam: true, confidence: 80, reason: 'Feedback too short (< 3 words)' };
  }

  // Known spam indicators
  if (SPAM_INDICATORS.some(s => lowerText === s || lowerText.includes(s) && words.length < 5)) {
    return { isSpam: true, confidence: 85, reason: 'Contains non-informative filler text' };
  }

  // Repetition detection
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const uniqueRatio = uniqueWords.size / words.length;
  if (words.length > 5 && uniqueRatio < 0.3) {
    return { isSpam: true, confidence: 75, reason: 'High word repetition detected' };
  }

  // Random character strings
  const avgWordLen = words.reduce((a, b) => a + b.length, 0) / words.length;
  if (avgWordLen > 12) {
    return { isSpam: true, confidence: 70, reason: 'Contains random character strings' };
  }

  // Calculate legitimate score
  const hasSubstance = POSITIVE_WORDS.some(w => lowerText.includes(w)) ||
    NEGATIVE_WORDS.some(w => lowerText.includes(w)) ||
    Object.values(ASPECT_KEYWORDS).flat().some(k => lowerText.includes(k));

  if (hasSubstance) {
    return { isSpam: false, confidence: 85, reason: 'Contains meaningful feedback content' };
  }

  if (words.length >= 8) {
    return { isSpam: false, confidence: 70, reason: 'Sufficient length' };
  }

  return { isSpam: false, confidence: 60, reason: 'Borderline content' };
}

// ─── 4. Urgency Detection ────────────────────────────────────────────────────

/**
 * Detects urgency level of feedback.
 * Returns: { level: 'critical'|'high'|'medium'|'low', score, triggers }
 */
export function detectUrgency(text) {
  const lowerText = (text || '').toLowerCase();
  const triggers = [];
  let score = 0;

  URGENCY_HIGH.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      triggers.push({ keyword, severity: 'critical' });
      score += 3;
    }
  });

  URGENCY_MEDIUM.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      triggers.push({ keyword, severity: 'high' });
      score += 1;
    }
  });

  // Exclamation and caps boost
  const exclamations = (text.match(/!/g) || []).length;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / (text.length || 1);
  if (exclamations >= 2) score += 1;
  if (capsRatio > 0.3) score += 1;

  let level;
  if (score >= 6) level = 'critical';
  else if (score >= 3) level = 'high';
  else if (score >= 1) level = 'medium';
  else level = 'low';

  return { level, score, triggers };
}

// ─── 5. Duplicate / Similar Feedback Detection ───────────────────────────────

/**
 * Finds duplicate or near-duplicate feedbacks in a list.
 * Returns: array of { feedbackId1, feedbackId2, similarity, isDuplicate }
 */
export function findDuplicates(feedbacks, threshold = 0.75) {
  const duplicates = [];

  for (let i = 0; i < feedbacks.length; i++) {
    for (let j = i + 1; j < feedbacks.length; j++) {
      const text1 = feedbacks[i].comment || feedbacks[i].text || '';
      const text2 = feedbacks[j].comment || feedbacks[j].text || '';

      if (!text1 || !text2) continue;

      const tokens1 = tokenize(text1);
      const tokens2 = tokenize(text2);
      const freq1 = getWordFrequency(tokens1);
      const freq2 = getWordFrequency(tokens2);

      const cosine = cosineSimilarity(freq1, freq2);
      const jaccard = jaccardSimilarity(tokens1, tokens2);
      const similarity = (cosine * 0.6 + jaccard * 0.4);

      if (similarity >= threshold) {
        duplicates.push({
          feedbackId1: feedbacks[i].id,
          feedbackId2: feedbacks[j].id,
          similarity: Math.round(similarity * 100),
          isDuplicate: similarity >= 0.9,
        });
      }
    }
  }

  return duplicates;
}

// ─── 6. Topic Modeling (K-Means style clustering) ───────────────────────────

/**
 * Assigns each feedback a topic from predefined seeds.
 * Returns: { topicDistribution, feedbackTopics }
 */
export function modelTopics(feedbacks) {
  const feedbackTopics = feedbacks.map(fb => {
    const text = (fb.comment || fb.text || '').toLowerCase();
    const topicScores = {};

    for (const [topic, keywords] of Object.entries(TOPIC_SEEDS)) {
      let score = 0;
      keywords.forEach(kw => {
        const regex = new RegExp(kw, 'gi');
        const matches = text.match(regex);
        if (matches) score += matches.length;
      });
      topicScores[topic] = score;
    }

    const maxScore = Math.max(...Object.values(topicScores));
    const assignedTopic = maxScore === 0
      ? 'Overall Experience'
      : Object.entries(topicScores).sort((a, b) => b[1] - a[1])[0][0];

    return {
      id: fb.id,
      topic: assignedTopic,
      scores: topicScores,
    };
  });

  // Count distribution
  const topicDistribution = {};
  feedbackTopics.forEach(ft => {
    topicDistribution[ft.topic] = (topicDistribution[ft.topic] || 0) + 1;
  });

  return { feedbackTopics, topicDistribution };
}

// ─── 7. AI Feedback Summarizer ───────────────────────────────────────────────

/**
 * Extractive summarization — picks the most representative sentences.
 * Returns: { summary, keyPoints, positivePoints, negativePoints }
 */
export function summarizeFeedbacks(feedbacks) {
  const allComments = feedbacks
    .map(f => f.comment || f.text || '')
    .filter(c => c.trim().length > 10);

  if (allComments.length === 0) {
    return {
      summary: 'No feedback comments available to summarize.',
      keyPoints: [],
      positivePoints: [],
      negativePoints: [],
    };
  }

  // Collect all sentences
  const sentences = [];
  allComments.forEach(comment => {
    const parts = comment.split(/[.!?]+/).filter(s => s.trim().length > 10);
    parts.forEach(s => sentences.push(s.trim()));
  });

  // Score sentences by keyword density
  const scoredSentences = sentences.map(sentence => {
    const lower = sentence.toLowerCase();
    const tokens = tokenize(sentence);
    let score = tokens.length * 0.1; // Length bonus

    POSITIVE_WORDS.forEach(w => { if (lower.includes(w)) score += 2; });
    NEGATIVE_WORDS.forEach(w => { if (lower.includes(w)) score += 1.5; });
    Object.values(ASPECT_KEYWORDS).flat().forEach(k => { if (lower.includes(k)) score += 1; });

    // Diversity bonus (mentions multiple aspects)
    const aspectCount = Object.values(ASPECT_KEYWORDS)
      .filter(kws => kws.some(k => lower.includes(k))).length;
    score += aspectCount * 1.5;

    return { sentence, score };
  });

  const sorted = scoredSentences.sort((a, b) => b.score - a.score);
  const topSentences = sorted.slice(0, Math.min(5, sorted.length));

  // Separate positive and negative
  const positivePoints = [];
  const negativePoints = [];

  topSentences.forEach(({ sentence }) => {
    const lower = sentence.toLowerCase();
    const posCount = POSITIVE_WORDS.filter(w => lower.includes(w)).length;
    const negCount = NEGATIVE_WORDS.filter(w => lower.includes(w)).length;
    if (posCount > negCount) positivePoints.push(sentence);
    else if (negCount > posCount) negativePoints.push(sentence);
  });

  // Build summary
  const posTotal = feedbacks.filter(f => {
    const avg = f.avgRating || (f.answers ? Object.values(f.answers).filter(v => typeof v === 'number').reduce((a, b) => a + b, 0) / Object.values(f.answers).filter(v => typeof v === 'number').length : 3);
    return avg >= 3.5;
  }).length;

  const posPercent = Math.round((posTotal / feedbacks.length) * 100);
  const avgRating = feedbacks.reduce((sum, f) => sum + (f.avgRating || 3), 0) / feedbacks.length;

  const summary = `Analysis of ${feedbacks.length} feedback submissions shows an average rating of ${avgRating.toFixed(1)}/5 with ${posPercent}% positive responses. ` +
    (positivePoints.length > 0 ? `Key strengths include aspects related to ${positivePoints[0].slice(0, 60)}... ` : '') +
    (negativePoints.length > 0 ? `Areas needing improvement: ${negativePoints[0].slice(0, 60)}...` : 'Overall feedback is predominantly positive.');

  return {
    summary,
    keyPoints: topSentences.slice(0, 3).map(s => s.sentence),
    positivePoints: positivePoints.slice(0, 3),
    negativePoints: negativePoints.slice(0, 3),
  };
}

// ─── 8. AI Recommendation Engine ─────────────────────────────────────────────

/**
 * Generates improvement suggestions for a teacher based on their feedback analysis.
 */
export function generateRecommendations(teacherName, analysis, aspectAnalysis, emotionData) {
  const recommendations = [];
  const strengths = [];

  const avg = analysis.avgRating || 0;
  const negPct = analysis.negativePercent || 0;
  const posPct = analysis.positivePercent || 0;

  // Rating-based recommendations
  if (avg < 2.5) {
    recommendations.push({
      priority: 'critical',
      category: 'Overall Performance',
      suggestion: `Urgent attention required. Average rating of ${avg.toFixed(1)}/5 indicates significant student dissatisfaction. Consider immediate pedagogical review.`,
      action: 'Schedule meeting with HOD for performance improvement plan.',
    });
  } else if (avg < 3.5) {
    recommendations.push({
      priority: 'high',
      category: 'Teaching Effectiveness',
      suggestion: `Rating of ${avg.toFixed(1)}/5 suggests room for improvement in core teaching areas.`,
      action: 'Attend teaching methodology workshop and incorporate active learning techniques.',
    });
  } else if (avg >= 4.5) {
    strengths.push(`Exceptional overall performance with ${avg.toFixed(1)}/5 rating. Recognized as a high-impact educator.`);
  }

  // Aspect-specific recommendations
  if (aspectAnalysis) {
    for (const [aspect, data] of Object.entries(aspectAnalysis)) {
      if (data.sentiment === 'negative' && data.mentions > 0) {
        switch (aspect) {
          case 'teaching':
            recommendations.push({
              priority: 'high',
              category: 'Teaching Methods',
              suggestion: 'Students find teaching explanations unclear or hard to follow.',
              action: 'Use more visual aids, real-world examples, and step-by-step problem solving demonstrations.',
            });
            break;
          case 'faculty':
            recommendations.push({
              priority: 'high',
              category: 'Faculty Conduct',
              suggestion: 'Student feedback indicates concerns about faculty approachability or behavior.',
              action: 'Increase office hours, improve student interaction, and maintain a welcoming classroom environment.',
            });
            break;
          case 'labs':
            recommendations.push({
              priority: 'medium',
              category: 'Lab Sessions',
              suggestion: 'Practical sessions need improvement in organization or equipment.',
              action: 'Review lab manuals, ensure equipment is functional, and provide clearer lab instructions.',
            });
            break;
          case 'curriculum':
            recommendations.push({
              priority: 'medium',
              category: 'Course Content',
              suggestion: 'Students have concerns about syllabus coverage or assignment quality.',
              action: 'Review course pacing, ensure full syllabus coverage, and diversify assignment formats.',
            });
            break;
          case 'support':
            recommendations.push({
              priority: 'medium',
              category: 'Student Support',
              suggestion: 'Students feel inadequate support for doubts and queries.',
              action: 'Establish regular doubt-clearing sessions and be more responsive to student questions.',
            });
            break;
        }
      } else if (data.sentiment === 'positive' && data.mentions > 2) {
        const aspectLabels = {
          teaching: 'Teaching Methods', faculty: 'Faculty Engagement',
          labs: 'Lab Sessions', curriculum: 'Course Content', support: 'Student Support',
        };
        strengths.push(`Strong positive feedback for ${aspectLabels[aspect] || aspect} with ${data.mentions} mentions.`);
      }
    }
  }

  // Emotion-based recommendations
  if (emotionData) {
    const dominantEmotion = emotionData.dominant;
    if (dominantEmotion === 'frustration') {
      recommendations.push({
        priority: 'medium',
        category: 'Student Experience',
        suggestion: 'High frustration levels detected in student feedback.',
        action: 'Review course difficulty, provide more scaffolding for complex topics, and create a more supportive learning environment.',
      });
    } else if (dominantEmotion === 'anger') {
      recommendations.push({
        priority: 'high',
        category: 'Classroom Environment',
        suggestion: 'Significant anger/negative emotion detected in student feedback.',
        action: 'Review classroom policies, communication style, and grading fairness. Consider student feedback session.',
      });
    }
  }

  // If mostly positive
  if (recommendations.length === 0 && posPct > 70) {
    strengths.push(`Excellent performance! ${posPct}% of students gave positive feedback.`);
    recommendations.push({
      priority: 'low',
      category: 'Continuous Improvement',
      suggestion: 'Maintain current high standards while exploring innovative teaching approaches.',
      action: 'Consider mentoring junior faculty, developing new course materials, or applying for teaching excellence awards.',
    });
  }

  return {
    teacherName,
    overallRating: avg,
    recommendations: recommendations.slice(0, 5),
    strengths: strengths.slice(0, 3),
    generatedAt: new Date().toISOString(),
  };
}

// ─── 9. Language Detection ───────────────────────────────────────────────────

/**
 * Detects if the text contains Hindi/Hinglish content.
 * Returns: { language: 'english'|'hinglish'|'hindi', confidence }
 */
export function detectLanguage(text) {
  if (!text) return { language: 'english', confidence: 95 };

  const lowerText = text.toLowerCase();

  // Check for Devanagari characters
  const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  if (hindiChars > 3) {
    return { language: 'hindi', confidence: 95 };
  }

  // Check Hinglish
  const hinglishMatches = [...HINGLISH_POSITIVE, ...HINGLISH_NEGATIVE]
    .filter(w => lowerText.includes(w)).length;

  if (hinglishMatches >= 2) {
    return { language: 'hinglish', confidence: Math.min(90, 60 + hinglishMatches * 10) };
  }

  return { language: 'english', confidence: 85 };
}

// ─── 10. Confidence Score ────────────────────────────────────────────────────

/**
 * Computes an overall confidence score for AI analysis.
 */
export function computeConfidence(text, numFeedbacks) {
  let confidence = 50;

  // Length factor
  const wordCount = (text || '').split(/\s+/).filter(Boolean).length;
  confidence += Math.min(20, wordCount * 0.5);

  // Vocabulary richness
  const tokens = tokenize(text || '');
  const uniqueRatio = new Set(tokens).size / (tokens.length || 1);
  confidence += uniqueRatio * 15;

  // Feedback count factor
  confidence += Math.min(15, numFeedbacks * 1.5);

  return Math.min(95, Math.round(confidence));
}

// ─── 11. Full Analysis Pipeline ──────────────────────────────────────────────

/**
 * Runs complete AI analysis on a list of feedbacks for a teacher.
 */
export function runFullAnalysis(feedbacks) {
  if (!feedbacks || feedbacks.length === 0) {
    return {
      totalFeedbacks: 0,
      emotion: { dominant: 'neutral', emotions: {} },
      aspects: {},
      spam: { count: 0, percent: 0 },
      urgency: { critical: 0, high: 0, medium: 0, low: 0 },
      topics: { feedbackTopics: [], topicDistribution: {} },
      duplicates: [],
      summary: null,
      confidence: 0,
    };
  }

  // Filter out demo feedbacks for analysis (optional)
  const textFeedbacks = feedbacks.filter(f => f.comment || f.text);

  // Run all analyses
  const spamResults = feedbacks.map(f => ({
    ...f,
    spamCheck: detectSpam(f.comment || f.text || ''),
  }));
  const spamCount = spamResults.filter(f => f.spamCheck.isSpam).length;

  const urgencyResults = feedbacks.map(f => ({
    ...f,
    urgency: detectUrgency(f.comment || f.text || ''),
  }));
  const urgencyDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
  urgencyResults.forEach(f => { urgencyDistribution[f.urgency.level]++; });

  // Aggregate text for emotion detection
  const allText = feedbacks.map(f => f.comment || f.text || '').join('. ');
  const emotion = detectEmotion(allText);
  const { aspects } = analyzeAspects(allText);
  const topics = modelTopics(feedbacks);
  const duplicates = textFeedbacks.length > 1 ? findDuplicates(textFeedbacks, 0.8) : [];
  const summary = summarizeFeedbacks(feedbacks);
  const languages = feedbacks.map(f => detectLanguage(f.comment || f.text || ''));
  const languageDistribution = { english: 0, hinglish: 0, hindi: 0 };
  languages.forEach(l => { languageDistribution[l.language]++; });

  const avgRating = feedbacks.reduce((sum, f) => sum + (f.avgRating || 3), 0) / feedbacks.length;
  const confidence = computeConfidence(allText, feedbacks.length);

  return {
    totalFeedbacks: feedbacks.length,
    avgRating: Math.round(avgRating * 10) / 10,
    emotion,
    aspects,
    spam: {
      count: spamCount,
      percent: Math.round((spamCount / feedbacks.length) * 100),
      flaggedFeedbacks: spamResults.filter(f => f.spamCheck.isSpam),
    },
    urgency: urgencyDistribution,
    urgentFeedbacks: urgencyResults.filter(f => ['critical', 'high'].includes(f.urgency.level)),
    topics,
    duplicates,
    summary,
    languages: languageDistribution,
    confidence,
  };
}

// ─── 12. Trend Analysis ───────────────────────────────────────────────────────

/**
 * Analyzes feedback trends over time (by month/week).
 * Returns: { monthlyTrends, trendDirection }
 */
export function analyzeTrends(feedbacks) {
  const byMonth = {};

  feedbacks.forEach(fb => {
    const date = new Date(fb.submittedAt || fb.createdAt || Date.now());
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[monthKey]) byMonth[monthKey] = { feedbacks: [], ratings: [] };
    byMonth[monthKey].feedbacks.push(fb);
    byMonth[monthKey].ratings.push(fb.avgRating || 3);
  });

  const monthlyTrends = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      count: data.feedbacks.length,
      avgRating: Math.round((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length) * 10) / 10,
    }));

  // Determine trend direction
  let trendDirection = 'stable';
  if (monthlyTrends.length >= 2) {
    const first = monthlyTrends[0].avgRating;
    const last = monthlyTrends[monthlyTrends.length - 1].avgRating;
    if (last - first > 0.3) trendDirection = 'improving';
    else if (first - last > 0.3) trendDirection = 'declining';
  }

  return { monthlyTrends, trendDirection };
}

export default {
  detectEmotion,
  analyzeAspects,
  aggregateAspects,
  detectSpam,
  detectUrgency,
  findDuplicates,
  modelTopics,
  summarizeFeedbacks,
  generateRecommendations,
  detectLanguage,
  computeConfidence,
  runFullAnalysis,
  analyzeTrends,
};

