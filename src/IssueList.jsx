import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import { Redirect } from 'react-router-dom';
import { Panel } from 'react-bootstrap';

import IssueAdd from './IssueAdd';
import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';

export default class IssueList extends React.Component {
  static stringifyQuery(query) {
    if (query) {
      let queryString = '?';
      if (query.status) queryString += `status=${query.status}&`;
      if (query.effort_gte) queryString += `effort_gte=${query.effort_gte}&`;
      if (query.effort_lte) queryString += `effort_lte=${query.effort_lte}&`;
      return queryString.slice(0, queryString.length - 1);
    }
    return '';
  }

  static parseQuery(queryString) {
    const query = {};
    const statusIndex = queryString.indexOf('status');
    if (statusIndex >= 0) {
      const statusSub = queryString.slice(statusIndex);
      const endIndex = statusSub.indexOf('&');
      if (endIndex >= 0) {
        query.status = statusSub.slice(7, endIndex);
      } else {
        query.status = statusSub.slice(7);
      }
    }
    const effortGteIndex = queryString.indexOf('effort_gte');
    if (effortGteIndex >= 0) {
      const effortGteSub = queryString.slice(effortGteIndex);
      const endIndex = effortGteSub.indexOf('&');
      if (endIndex >= 0) {
        query.effort_gte = effortGteSub.slice(11, endIndex);
      } else {
        query.effort_gte = effortGteSub.slice(11);
      }
    }
    const effortLteIndex = queryString.indexOf('effort_lte');
    if (effortLteIndex >= 0) {
      const effortLteSub = queryString.slice(effortLteIndex);
      const endIndex = effortLteSub.indexOf('&');
      if (endIndex >= 0) {
        query.effort_lte = effortLteSub.slice(11, endIndex);
      } else {
        query.effort_lte = effortLteSub.slice(11);
      }
    }
    return query;
  }

  constructor() {
    super();
    this.state = { issues: [], query: '' };
    this.createIssue = this.createIssue.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.search;
    const newQuery = this.props.location.search;
    if (oldQuery === newQuery) return;
    this.loadData();
  }

  setFilter(query) {
    this.setState({ query: IssueList.stringifyQuery(query) });
  }

  loadData() {
    fetch(`/api/issues${this.props.location.search}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          data.records.forEach((issue) => {
            issue.created = new Date(issue.created);
            if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
            if (issue.effort) issue.effort = parseInt(issue.effort, 10);
          });
          this.setState({ issues: data.records });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to fetch issues: ${error.message}`);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  createIssue(newIssue) {
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    }).then((response) => {
      if (response.ok) {
        response.json().then((updatedIssue) => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) {
            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          }
          const newIssues = this.state.issues.concat(updatedIssue);
          this.setState({ issues: newIssues });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to add issue: ${error.message}`);
        });
      }
    }).catch((err) => {
      alert(`Error in sending data to server: ${err.message}`);
    });
  }

  deleteIssue(id) {
    fetch(`/api/issues/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) alert('Failed to delete issue');
        else this.loadData();
      });
  }

  render() {
    if (this.state.query !== this.props.location.search) {
      return <Redirect to={`/issues${this.state.query}`} />;
    }
    return (
      <div>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <IssueFilter
              setFilter={this.setFilter}
              initFilter={IssueList.parseQuery(this.props.location.search)}
            />
          </Panel.Collapse>
        </Panel>
        <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }),
};

IssueList.defaultProps = {
  location: '',
};
