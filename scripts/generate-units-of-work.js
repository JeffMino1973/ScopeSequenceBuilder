import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load curriculum data
const curriculumPath = path.join(__dirname, '../server/curriculum-data.json');
const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

function generateUnitOfWork(unitName, subject, description, outcomes) {
  const weeklyActivities = [];
  
  for (let week = 1; week <= 8; week++) {
    const activities = {
      week,
      focus: getWeeklyFocus(week, unitName, subject),
      learningActivities: getWeeklyActivities(week, unitName, subject),
      assessment: getWeeklyAssessment(week, unitName)
    };
    weeklyActivities.push(activities);
  }

  return {
    overview: description || `This unit explores ${unitName.toLowerCase()} through engaging, hands-on activities designed for life skills students. Students will develop practical skills while building confidence and independence.`,
    duration: "8 weeks",
    rationale: `This unit addresses the specific learning needs of life skills students by providing structured, scaffolded learning experiences. The focus on ${unitName.toLowerCase()} helps students develop essential skills for daily living and future participation in the community.`,
    learningObjectives: [
      `Demonstrate understanding of key concepts related to ${unitName.toLowerCase()}`,
      "Participate actively in group and individual learning activities",
      "Apply learned skills in practical, real-world contexts",
      "Build confidence and independence through progressive skill development"
    ],
    weeklyPlan: weeklyActivities,
    assessmentStrategies: [
      "Observation of student participation and engagement",
      "Practical demonstrations of learned skills",
      "Student work samples and portfolios",
      "Self-assessment and reflection activities",
      "Formative assessment through weekly check-ins"
    ],
    differentiationStrategies: [
      "Visual supports and social stories",
      "Hands-on, concrete learning materials",
      "Modified tasks and activities based on individual learning needs",
      "Peer support and collaborative learning opportunities",
      "Technology integration for engagement and accessibility",
      "Flexible grouping arrangements"
    ],
    resourcesNeeded: [
      "Visual aids and picture cue cards",
      "Hands-on manipulatives and materials",
      "Technology devices (tablets, interactive whiteboard)",
      "Adapted learning materials",
      "Sensory-friendly environment setup"
    ],
    safeguardsAndConsiderations: [
      "Ensure all activities are accessible and inclusive",
      "Provide appropriate supervision and support",
      "Consider sensory needs and preferences",
      "Maintain clear routines and visual schedules",
      "Communicate regularly with families and support staff"
    ]
  };
}

function getWeeklyFocus(week, unitName, subject) {
  const focuses = {
    1: `Introduction to ${unitName} - Building foundational understanding`,
    2: `Exploring key concepts through hands-on activities`,
    3: `Developing practical skills and techniques`,
    4: `Application and practice in varied contexts`,
    5: `Building independence and confidence`,
    6: `Real-world application and community connections`,
    7: `Review, consolidation and extension activities`,
    8: `Celebration of learning and reflection`
  };
  return focuses[week] || `Continuing development of ${unitName} skills`;
}

function getWeeklyActivities(week, unitName, subject) {
  const baseActivities = [
    "Morning routine and check-in activity",
    "Explicit teaching with visual supports",
    "Guided practice with teacher modeling",
    "Independent or small group work",
    "Review and reflection session"
  ];
  
  return baseActivities;
}

function getWeeklyAssessment(week, unitName) {
  if (week === 1) return "Initial assessment of prior knowledge and skills";
  if (week === 4) return "Mid-unit check-in and formative assessment";
  if (week === 8) return "End of unit assessment and celebration";
  return "Ongoing observation and documentation of progress";
}

// Generate unit of work for each subject's unit details
for (const [subjectId, subjectData] of Object.entries(curriculumData)) {
  console.log(`Processing subject: ${subjectId}`);
  
  if (subjectData.unitDetails) {
    for (const [unitName, unitData] of Object.entries(subjectData.unitDetails)) {
      if (unitName !== 'default') {
        console.log(`  - Generating unit of work for: ${unitName}`);
        unitData.unitOfWork = generateUnitOfWork(
          unitName,
          subjectId,
          unitData.description,
          unitData.outcomes
        );
      }
    }
  }
}

// Save updated curriculum data
fs.writeFileSync(curriculumPath, JSON.stringify(curriculumData, null, 2));
console.log('\n✅ Successfully generated units of work for all topics!');
console.log(`📊 Total subjects processed: ${Object.keys(curriculumData).length}`);
