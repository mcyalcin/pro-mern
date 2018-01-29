import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import IssueRow from './IssueRow';

export default function IssueTable(props) {
  const issueRows = props.issues.map(issue => (
    <IssueRow
      key={issue._id}
      issue={issue}
      deleteIssue={props.deleteIssue}
    />
  ));
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completed</th>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  deleteIssue: PropTypes.func.isRequired,
};
