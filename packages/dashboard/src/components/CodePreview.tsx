import { motion } from 'framer-motion';

export default function CodePreview() {
  const code = [
    { line: '// Drop in 3 lines. Track everything.', color: '#71717a' },
    { line: '', color: '' },
    { line: 'import { SpendTrack } from \'@spendtrack/sdk\'', color: '#fafafa', tokens: [
      { text: 'import', color: '#c084fc' },
      { text: ' { ', color: '#fafafa' },
      { text: 'SpendTrack', color: '#67e8f9' },
      { text: ' } ', color: '#fafafa' },
      { text: 'from', color: '#c084fc' },
      { text: ' \'@spendtrack/sdk\'', color: '#fde68a' },
    ]},
    { line: 'import Anthropic from \'@anthropic-ai/sdk\'', color: '#fafafa', tokens: [
      { text: 'import', color: '#c084fc' },
      { text: ' Anthropic ', color: '#67e8f9' },
      { text: 'from', color: '#c084fc' },
      { text: ' \'@anthropic-ai/sdk\'', color: '#fde68a' },
    ]},
    { line: '', color: '' },
    { line: 'const tracker = new SpendTrack({ projectId: \'my-app\' })', color: '#fafafa', tokens: [
      { text: 'const', color: '#c084fc' },
      { text: ' tracker ', color: '#fafafa' },
      { text: '=', color: '#f472b6' },
      { text: ' ', color: '#fafafa' },
      { text: 'new', color: '#c084fc' },
      { text: ' ', color: '#fafafa' },
      { text: 'SpendTrack', color: '#67e8f9' },
      { text: '({ projectId: ', color: '#fafafa' },
      { text: '\'my-app\'', color: '#fde68a' },
      { text: ' })', color: '#fafafa' },
    ]},
    { line: 'const client = tracker.wrap(new Anthropic())', color: '#fafafa', tokens: [
      { text: 'const', color: '#c084fc' },
      { text: ' client ', color: '#fafafa' },
      { text: '=', color: '#f472b6' },
      { text: ' tracker.', color: '#fafafa' },
      { text: 'wrap', color: '#a5b4fc' },
      { text: '(', color: '#fafafa' },
      { text: 'new', color: '#c084fc' },
      { text: ' ', color: '#fafafa' },
      { text: 'Anthropic', color: '#67e8f9' },
      { text: '())', color: '#fafafa' },
    ]},
    { line: '', color: '' },
    { line: '// That\'s it. Every API call now logs to your dashboard.', color: '#71717a' },
    { line: 'await client.messages.create({ /* ... */ })', color: '#fafafa', tokens: [
      { text: 'await', color: '#c084fc' },
      { text: ' client.messages.', color: '#fafafa' },
      { text: 'create', color: '#a5b4fc' },
      { text: '({ ', color: '#fafafa' },
      { text: '/* ... */', color: '#71717a' },
      { text: ' })', color: '#fafafa' },
    ]},
  ];

  return (
    <motion.div
      className="code-preview"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="code-header">
        <div className="code-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <div className="code-filename">app.ts</div>
      </div>
      <div className="code-body">
        {code.map((line, i) => (
          <motion.div
            key={i}
            className="code-line"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <span className="line-number">{i + 1}</span>
            <span className="line-content">
              {line.tokens ? (
                line.tokens.map((token, ti) => (
                  <span key={ti} style={{ color: token.color }}>{token.text}</span>
                ))
              ) : (
                <span style={{ color: line.color || '#fafafa' }}>{line.line || ' '}</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
