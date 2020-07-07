import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ComicsTable from "./comicsTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getComics, deleteComic } from "../services/comicService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Comics extends Component {
  state = {
    comics: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    console.log(data);
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: comics } = await getComics();
    this.setState({ comics, genres });
  }

  handleDelete = async (comic) => {
    const originalComics = this.state.comics;
    const comics = originalComics.filter((m) => m._id !== comic._id);
    this.setState({ comics });

    try {
      await deleteComic(comic._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This comic has already been deleted.");

      this.setState({ comics: originalComics });
    }
  };

  handleLike = (comic) => {
    const comics = [...this.state.comics];
    const index = comics.indexOf(comic);
    comics[index] = { ...comics[index] };
    comics[index].liked = !comics[index].liked;
    this.setState({ comics });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      comics: allComics,
    } = this.state;

    let filtered = allComics;
    if (searchQuery)
      filtered = allComics.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allComics.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const comics = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: comics };
  };

  render() {
    const { length: count } = this.state.comics;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no comics in the database.</p>;

    const { totalCount, data: comics } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/comics/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Comic
            </Link>
          )}
          <p>Showing {totalCount} comics in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ComicsTable
            comics={comics}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Comics;
