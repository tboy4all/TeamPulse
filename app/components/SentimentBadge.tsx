// app/components/SentimentBadge.tsx

interface Props {
  score: number
}

const SentimentBadge = ({ score }: Props) => {
  let label = ''
  let emoji = ''

  if (score >= 0.5) {
    emoji = '😊'
    label = 'Positive'
  } else if (score <= -0.5) {
    emoji = '😞'
    label = 'Negative'
  } else {
    emoji = '😐'
    label = 'Neutral'
  }

  return (
    <span className='inline-flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-100 border'>
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}

export default SentimentBadge
