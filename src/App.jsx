import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import Header from './Header';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found</p>;

const RoutedApp = () => (
  <div className="container-fluid">
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Redirect exact from="/" to="/issues" />
          <Route exact path="/issues" component={IssueList} />
          <Route exact path="/issues/:id" component={IssueEdit} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </div>
    </BrowserRouter>
    <h5>
      <small>
        Full source code not available at any GitHub repository.
      </small>
    </h5>
  </div>
);

ReactDOM.render(<RoutedApp />, contentNode);

if (module.hot) {
  module.hot.accept();
}
