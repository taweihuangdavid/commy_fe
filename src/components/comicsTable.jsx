import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";
import Like from "./common/like";

class ComicsTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (comic) => (
        <Link to={`/comics/${comic._id}`}>{comic.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (comic) => (
        <Like liked={comic.liked} onClick={() => this.props.onLike(comic)} />
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (comic) => (
      <button
        onClick={() => this.props.onDelete(comic)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { comics, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={comics}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ComicsTable;
