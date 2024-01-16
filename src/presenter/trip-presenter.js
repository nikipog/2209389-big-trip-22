import PointsListView from '../view/points-list-view.js';
import FilterView from '../view/filter-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import InfoTripView from '../view/info-trip-view.js';
import { RenderPosition } from '../render.js';
import { render, replace } from '../framework/render.js';
import NoPointsView from '../view/no-points-view.js';
import { generateFilter } from '../model/point-model.js';

export default class TripPresenter {
  #sortComponent = new SortView();
  #noPointsComponent = new NoPointsView();
  #pointsListComponent = new PointsListView();
  #infoTripComponent = new InfoTripView();
  #filterComponent = null;
  #container = null;
  #pointModel = null;
  #infoTripElement = null;
  #filterElement = null;

  constructor ({ container, pointModel, infoTripElement, filterElement }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#infoTripElement = infoTripElement;
    this.#filterElement = filterElement;
  }

  init () {
    this.#renderTripEvents();
  }

  #renderPoint (point, destinations, offers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView ({
      point, destinations, offers,
      onRollupButtonClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView ({
      point,
      destinations,
      offers,
      onEditFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupButtonClick: () => {
        replaceFormToPoint();
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render (pointComponent, this.#pointsListComponent.element);
  }

  #renderSort () {
    render(this.#sortComponent, this.#container);
  }

  #renderNoPoints () {
    render (this.#noPointsComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderInfoTrip () {
    render(this.#infoTripComponent, this.#infoTripElement, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList () {
    render(this.#pointsListComponent, this.#container);
  }

  #renderFilter () {

    const points = this.#pointModel.points;
    const filters = generateFilter(points);

    this.#filterComponent = new FilterView({filters});
    render(this.#filterComponent, this.#filterElement);

  }

  #renderTripEvents() {
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations;
    const offers = this.#pointModel.offers;


    if (points.length === 0) {
      this.#renderNoPoints ();
      return;
    }

    this.#renderInfoTrip();
    this.#renderSort();
    this.#renderPointsList();
    this.#renderFilter();

    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }
  }
}
