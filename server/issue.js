const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
};

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
};

function cleanupIssue(issue) {
  const cleanIssue = {};
  Object.keys(issue).forEach((field) => {
    if (issueFieldType[field]) cleanIssue[field] = issue[field];
  });
  return cleanIssue;
}

function validateIssue(issue) {
  const errors = [];
  Object.keys(issueFieldType).forEach((field) => {
    if (issueFieldType[field] === 'required' && !issue[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (!validIssueStatus[issue.status]) {
    errors.push(`${issue.status} is not a valid status.`);
  }

  return (errors.length ? errors.join('; ') : null);
}

function convertIssue(issue) {
  if (issue.created) issue.created = new Date(issue.created);
  if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
  return cleanupIssue(issue);
}

export default {
  validateIssue,
  cleanupIssue,
  convertIssue,
};