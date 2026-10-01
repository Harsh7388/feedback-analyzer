// Sentiment Analysis Engine for FeedSense
// AIML-based sentiment classifier using lexicon approach + ML-inspired scoring

const positiveWords = [
  'excellent', 'outstanding', 'amazing', 'fantastic', 'wonderful', 'great', 'good',
  'helpful', 'clear', 'effective', 'knowledgeable', 'engaging', 'passionate', 'creative',
  'encouraging', 'patient', 'thorough', 'organized', 'professional', 'inspiring',
  'best', 'love', 'liked', 'enjoyed', 'learned', 'understand', 'improved', 'brilliant',
  'superb', 'exceptional', 'perfect', 'impressive', 'motivated', 'supportive', 'awesome',
  'satisfied', 'happy', 'positive', 'productive', 'interactive', 'interesting', 'fun'
];

const negativeWords = [
  'bad', 'poor', 'terrible', 'awful', 'worst', 'boring', 'confusing', 'unclear',
  'difficult', 'unhelpful', 'unprepared', 'disorganized', 'late', 'absent', 'rude',
  'monotonous', 'ineffective', 'disappointing', 'frustrated', 'lost', 'failed',
  'waste', 'irrelevant', 'slow', 'fast', 'hard', 'tough', 'challenging', 'weak',
  'useless', 'improve', 'lacks', 'missing', 'incomplete', 'unhappy', 'dissatisfied'
];

const negationWords = ['not', 'no', 'never', 'neither', 'hardly', 'barely', "don't", "doesn't", "didn't", "wasn't", "isn't", "aren't"];

const intensifiers = ['very', 'extremely', 'absolutely', 'completely', 'totally', 'highly', 'really', 'super', 'incredibly'];

/**
 * Tokenize text into lowercase words
 */
function tokenize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
}

/**
 * Calculate sentiment score for a single text
 * Returns: { score: -1 to 1, label: 'positive'|'negative'|'neutral', confidence: 0-100 }
 */
export function analyzeSentiment(text) {
  if (!text || text.trim().length === 0) {
    return { score: 0, label: 'neutral', confidence: 50, emoji: '😐' };
  }

  const tokens = tokenize(text);
  let score = 0;
  let wordCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    const prevWord = i > 0 ? tokens[i - 1] : '';
    const prevPrevWord = i > 1 ? tokens[i - 2] : '';
    const isNegated = negationWords.includes(prevWord) || negationWords.includes(prevPrevWord);
    const hasIntensifier = intensifiers.includes(prevWord);
    const multiplier = hasIntensifier ? 1.5 : 1.0;

    if (positiveWords.includes(word)) {
      score += isNegated ? -1.5 * multiplier : 1.0 * multiplier;
      wordCount++;
    } else if (negativeWords.includes(word)) {
      score += isNegated ? 1.5 * multiplier : -1.0 * multiplier;
      wordCount++;
    }
  }

  // Normalize score
  const normalizedScore = wordCount > 0 ? Math.max(-1, Math.min(1, score / Math.max(wordCount, 3))) : 0;
  
  // Determine label
  let label, emoji;
  if (normalizedScore > 0.15) {
    label = 'positive';
    emoji = normalizedScore > 0.5 ? '😄' : '🙂';
  } else if (normalizedScore < -0.15) {
    label = 'negative';
    emoji = normalizedScore < -0.5 ? '😞' : '😕';
  } else {
    label = 'neutral';
    emoji = '😐';
  }

  // Confidence: higher when more sentiment words are found
  const confidence = Math.min(95, 50 + Math.abs(normalizedScore) * 45 + wordCount * 3);

  return {
    score: normalizedScore,
    label,
    confidence: Math.round(confidence),
    emoji,
  };
}

/**
 * Analyze ratings (1-5 scale) and convert to sentiment
 */
export function ratingToSentiment(avgRating) {
  if (avgRating >= 4.5) return { label: 'positive', emoji: '😄', color: '#22c55e' };
  if (avgRating >= 3.5) return { label: 'positive', emoji: '🙂', color: '#84cc16' };
  if (avgRating >= 2.5) return { label: 'neutral', emoji: '😐', color: '#eab308' };
  if (avgRating >= 1.5) return { label: 'negative', emoji: '😕', color: '#f97316' };
  return { label: 'negative', emoji: '😞', color: '#ef4444' };
}

/**
 * Analyze all feedbacks for a subject or teacher
 * Returns aggregated sentiment analysis
 */
export function aggregateFeedbacks(feedbacks) {
  if (!feedbacks || feedbacks.length === 0) {
    return {
      totalFeedbacks: 0,
      avgRating: 0,
      sentimentLabel: 'neutral',
      sentimentScore: 0,
      positivePercent: 0,
      negativePercent: 0,
      neutralPercent: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      topKeywords: [],
    };
  }

  const sentiments = feedbacks.map(f => {
    const textSentiment = analyzeSentiment(f.comment || '');
    const ratingScore = f.avgRating ? (f.avgRating - 3) / 2 : 0; // normalize 1-5 to -1,1
    const combinedScore = (textSentiment.score * 0.4 + ratingScore * 0.6);
    return { ...textSentiment, score: combinedScore };
  });

  const avgScore = sentiments.reduce((a, b) => a + b.score, 0) / sentiments.length;
  const positive = sentiments.filter(s => s.score > 0.15).length;
  const negative = sentiments.filter(s => s.score < -0.15).length;
  const neutral = sentiments.length - positive - negative;

  const allRatings = feedbacks.map(f => f.avgRating || 3);
  const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allRatings.forEach(r => {
    const rounded = Math.round(r);
    if (rounded >= 1 && rounded <= 5) distribution[rounded]++;
  });

  // Extract keywords from comments
  const allComments = feedbacks.map(f => f.comment || '').join(' ');
  const words = tokenize(allComments);
  const wordFreq = {};
  words.forEach(w => {
    if (w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'what', 'when', 'which', 'will', 'your', 'more', 'also'].includes(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count, sentiment: positiveWords.includes(word) ? 'positive' : negativeWords.includes(word) ? 'negative' : 'neutral' }));

  return {
    totalFeedbacks: feedbacks.length,
    avgRating: Math.round(avgRating * 10) / 10,
    sentimentScore: Math.round(avgScore * 100) / 100,
    sentimentLabel: avgScore > 0.15 ? 'positive' : avgScore < -0.15 ? 'negative' : 'neutral',
    positivePercent: Math.round((positive / feedbacks.length) * 100),
    negativePercent: Math.round((negative / feedbacks.length) * 100),
    neutralPercent: Math.round((neutral / feedbacks.length) * 100),
    ratingDistribution: distribution,
    topKeywords,
  };
}

/**
 * Get color for sentiment
 */
export function getSentimentColor(label) {
  switch (label) {
    case 'positive': return { bg: 'bg-green-500', text: 'text-green-400', hex: '#22c55e' };
    case 'negative': return { bg: 'bg-red-500', text: 'text-red-400', hex: '#ef4444' };
    default: return { bg: 'bg-yellow-500', text: 'text-yellow-400', hex: '#eab308' };
  }
}
