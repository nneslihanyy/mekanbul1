import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AdminButton from "./AdminButton";
import Header from "./Header";
import VenueReducer from "../services/VenueReducer";
import VenueDataService from "../services/VenueDataService";
function AddUpdateVenue() {
  const { id } = useParams();
  let location = useLocation();
  var navigate = useNavigate();
  const [venue, dispatchVenues] = React.useReducer(VenueReducer, {
    data: [],
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: "",
  });
  React.useEffect(() => {
    if (location.state.action == "update") {
      dispatchVenues({ type: "FETCH_INIT" });
      try {
        VenueDataService.getVenue(id).then((result) => {
          dispatchVenues({
            type: "FETCH_SUCCESS",
            payload: result.data,
          });
        });
      } catch {
        dispatchVenues({ type: "FETCH_FAILURE" });
      }
    }
  }, []);
  const performClick = (evt) => {
    evt.preventDefault();
    const name = evt.target[0].value;
    const address = evt.target[1].value;
    const foodanddrink = evt.target[2].value;
    const [lat, long] = evt.target[3].value.split(",");
    const day1 = evt.target[4].value;
    const [open1, close1] = evt.target[5].value.split(",");
    const isClosed1 = true;
    const day2 = evt.target[6].value;
    const [open2, close2] = evt.target[7].value.split(",");
    const isClosed2 = true;

    // Eklenecek veya güncellenecek Venue bilgisi
    const obj = {
      name,
      address,
      foodanddrink,
      lat: Number(lat),
      long: Number(long),
      day1,
      day2,
      open1,
      open2,
      close1,
      close2,
      isClosed1,
      isClosed2,
    };

    // Alanların dolu mu boş mu olduğu kontrolü
    if (
      name &&
      address &&
      foodanddrink &&
      lat &&
      long &&
      day1 &&
      day2 &&
      open1 &&
      open2 &&
      close1 &&
      close2 &&
      isClosed1 &&
      isClosed2
    ) {
      
      // Ekleme durumu
      if (location.state.action === "new") {
        VenueDataService.addVenue(obj)
          .then(() => {
            dispatchVenues({ type: "ADD_VENUE_SUCCESS" });
            navigate("/admin");
          })
          .catch((error) => {
            dispatchVenues({
              type: "ADD_VENUE_FAILURE",
              payload: {
                error: `Error: ${error}`,
              },
            });
          });
      }

      // Güncelleme durumu
      else {
        VenueDataService.updateVenue(id,obj)
          .then(() => {
            dispatchVenues({ type: "ADD_VENUE_SUCCESS" });
            navigate("/admin");
          })
          .catch((error) => {
            dispatchVenues({
              type: "ADD_VENUE_FAILURE",
              payload: {
                error: `Error: ${error}`,
              },
            });
          });
      }

    } else {
      dispatchVenues({
        type: "ADD_VENUE_FAILURE",
        payload: {
          error: "Alanların tümünü doldurunuz..!",
        },
      });
    }
  };
  return (
    <>
      {location.state.action == "new" ? (
        <Header headerText="Yönetici" motto="Yeni mekan ekleyin!" />
      ) : venue.isSuccess ? (
        <Header
          headerText="Yönetici"
          motto={venue.data.name + " mekanını güncelleyin!"}
        />
      ) : (
        <Header headerText="Yönetici" />
      )}

      {!venue.isSuccess && (
        <h4
          style={{
            background: "red",
            color: "white",
            textAlign: "center",
            padding: 8,
          }}
        >
          {venue.error}
        </h4>
      )}

      <div className="col-xs-12 col-md-6">
        <form className="form-horizontal" id="addVenue" onSubmit={performClick}>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Ad:</label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="name"
                defaultValue={venue.data.name ? venue.data.name : ""}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Adres:</label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="address"
                defaultValue={venue.data.address ? venue.data.address : ""}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              İmkanlar:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="foodanddrink"
                defaultValue={
                  venue.data.foodanddrink ? venue.data.foodanddrink : ""
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              Enlem & Boylam:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="coordinates"
                defaultValue={
                  venue.data.coordinates
                    ? venue.data.coordinates[0] +
                      "," +
                      venue.data.coordinates[1]
                    : ""
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              Günler-1:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="day1"
                defaultValue={venue.data.hours ? venue.data.hours[0].days : ""}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              Açılış & Kapanış-1:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="openclose1"
                defaultValue={
                  venue.data.hours
                    ? venue.data.hours[0].open + "," + venue.data.hours[0].close
                    : ""
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              Günler-2:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="day2"
                defaultValue={venue.data.hours ? venue.data.hours[1].days : ""}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">
              Açılış & Kapanış-2:
            </label>
            <div className="col-xs-12 col-sm-10">
              <input
                className="form-control"
                name="openclose2"
                defaultValue={
                  venue.data.hours
                    ? venue.data.hours[1].open + "," + venue.data.hours[1].close
                    : ""
                }
              />
            </div>
          </div>
          {venue.data.name ? (
            <AdminButton name="Güncelle" type="primary" />
          ) : (
            <AdminButton name="Ekle" type="primary" />
          )}
        </form>
      </div>
    </>
  );
}

export default AddUpdateVenue;
