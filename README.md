# Online Test Platform

A complete, production-ready React.js application for conducting professional online examinations with secure login, timer-based testing, and comprehensive result evaluation.

## Features

### 🔐 Secure Authentication
- Whitelist-based user authentication
- One-time test restriction per user
- Secure password validation
- User session management

### 📝 Test Interface
- 25-minute timer with auto-submission
- 20 randomly selected questions from a pool of 30
- Mix of Multiple Choice and Text-based questions
- Real-time answer persistence
- Question navigation with progress tracking
- Auto-save functionality

### 📊 Result Evaluation
- Automatic scoring for MCQ questions
- Keyword-based evaluation for text questions
- Detailed performance analytics
- Question-by-question review
- Downloadable result reports

### 💾 Data Persistence
- localStorage-based data storage
- Session recovery after browser refresh
- Timer state persistence
- Answer auto-save

## Tech Stack

- **Frontend**: React.js 19 with Next.js 14
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Form Handling**: Formik with Yup validation
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Analytics**: Vercel Analytics

## Project Structure

\`\`\`
src/
├── app/
│   ├── login/page.tsx          # Login interface
│   ├── test/page.tsx           # Test/exam interface
│   ├── result/page.tsx         # Results and review
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main app router
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── timer.tsx               # Timer component
│   ├── question-navigator.tsx  # Question navigation
│   └── test-progress.tsx       # Progress tracking
├── data/
│   ├── questions.js            # Question pool (30 questions)
│   ├── allowed-users.js        # Authorized users list
│   └── correct-answers.js      # Answer keys and keywords
├── utils/
│   ├── storage.js              # localStorage utilities
│   ├── test-logic.js           # Test logic and evaluation
│   ├── validation.js           # Form validation schemas
│   ├── auth.js                 # Authentication utilities
│   └── constants.js            # App constants
└── README.md
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

**Password**: `password123` (for all users)

**Authorized Users**:
- John Doe - john.doe@example.com
- Jane Smith - jane.smith@example.com
- Alice Johnson - alice.johnson@example.com
- Bob Wilson - bob.wilson@example.com
- Carol Brown - carol.brown@example.com
- David Lee - david.lee@example.com
- Emma Davis - emma.davis@example.com
- Frank Miller - frank.miller@example.com
- Grace Taylor - grace.taylor@example.com
- Henry Anderson - henry.anderson@example.com

## Configuration

### Adding New Users
Edit `data/allowed-users.js` to add or modify authorized users:

\`\`\`javascript
export const allowedUsers = [
  { name: "New User", email: "newuser@example.com" },
  // ... existing users
]
\`\`\`

### Modifying Questions
Edit `data/questions.js` to add or modify questions:

\`\`\`javascript
{
  id: 31,
  type: "mcq", // or "text"
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"], // for MCQ only
  category: "Question Category",
}
\`\`\`

### Updating Answer Keys
Edit `data/correct-answers.js` for answer evaluation:

\`\`\`javascript
// For MCQ questions
31: "Correct Option Text",

// For text questions
32: {
  keywords: ["keyword1", "keyword2", "keyword3"],
  minKeywords: 2, // minimum keywords required for correct answer
},
\`\`\`

### Test Configuration
Modify `utils/constants.js` to change test parameters:

\`\`\`javascript
export const TEST_CONFIG = {
  TIMER_DURATION: 25 * 60, // Test duration in seconds
  TOTAL_QUESTIONS: 20,     // Questions per test
  QUESTION_POOL_SIZE: 30,  // Total questions in pool
  PASSWORD: "password123", // Login password
}
\`\`\`

## Features in Detail

### Authentication System
- Validates users against a predefined whitelist
- Prevents multiple test attempts per user
- Maintains user session across browser refreshes
- Secure password validation

### Test Engine
- Randomly selects questions from the pool
- Supports both MCQ and text-based questions
- Real-time timer with visual warnings
- Auto-submission when time expires
- Progress tracking and navigation

### Evaluation System
- Automatic scoring for multiple-choice questions
- Keyword-based evaluation for text responses
- Detailed performance analytics
- Question-by-question review with correct answers
- Exportable results in JSON format

### Data Management
- All data stored in browser localStorage
- Automatic session recovery
- Real-time answer persistence
- User completion tracking

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- Client-side validation only (suitable for controlled environments)
- localStorage data can be cleared by users
- No server-side validation or data persistence
- Suitable for educational/training purposes

## Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- GitHub Pages (with static export)
- Any Node.js hosting provider

## Development

### Adding New Features
1. Follow the existing component structure
2. Use TypeScript for type safety
3. Maintain consistent styling with Tailwind CSS
4. Update this README for significant changes

### Testing
- Manual testing recommended for all user flows
- Test with different browsers and screen sizes
- Verify localStorage persistence across sessions

## License

This project is created for educational purposes. Feel free to modify and use as needed.

## Support

For issues or questions, please refer to the code comments and documentation within the source files.
