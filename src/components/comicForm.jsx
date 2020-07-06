import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getComic, saveComic } from "../services/comicService";
import { getGenres } from "../services/genreService";

class ComicForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateComic() {
    try {
      const comicId = this.props.match.params.id;
      if (comicId === "new") return;

      const { data: comic } = await getComic(comicId);
      this.setState({ data: this.mapToViewModel(comic) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateComic();
  }

  mapToViewModel(comic) {
    return {
      _id: comic._id,
      title: comic.title,
      genreId: comic.genre._id,
      numberInStock: comic.numberInStock,
      dailyRentalRate: comic.dailyRentalRate,
    };
  }

  doSubmit = async () => {
    await saveComic(this.state.data);

    this.props.history.push("/comics");
  };

  render() {
    return (
      <div>
        <h1>Comic Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default ComicForm;
