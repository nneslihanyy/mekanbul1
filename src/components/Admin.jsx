import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import VenueList from "./VenueList";
import VenueReducer from "../services/VenueReducer";
import React from "react";
import VenueDataService from "../services/VenueDataService";
function Admin() {
  const [deleteVenue, setDeleteVenue] = useState(false);

  // const { id } = useParams();
  var navigate = useNavigate();
  // let location = useLocation();

  const [venues, dispatchVenues] = React.useReducer(VenueReducer, {
    data: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleted: false,
  });

  useEffect(() => {
    dispatchVenues({
      type: "FETCH_INIT",
    });
    VenueDataService.listAllVenues()
      .then((val) => {
        dispatchVenues({
          type: "FETCH_SUCCESS",
          payload: val.data,
        });
      })
      .catch(() => {
        dispatchVenues({
          type: "FETCH_FAILURE",
        });
      });
  }, [deleteVenue]);

  function handleClick(evt, id) {
    evt.preventDefault();
    const eventName = evt.target.name;
    const venueID = id;
    switch (eventName) {
      case "Güncelle":
        navigate(`addupdate/venue/${venueID}`,{state: {action: 'update'}});
        break;
      case "Sil":
        VenueDataService.removeVenue(id).then(() => {
          dispatchVenues({ type: "REMOVE_VENUE" });
          setDeleteVenue(true);
        });
        setDeleteVenue(false);
        break;
      case 'Mekan Ekle':
        navigate(`addupdate/venue/new`,{state: {action: 'new'}});
        break;
      default:
        console.error("Geçersiz event!");
        break;
    }
  }
  return (
    <>
      <Header headerText="Yönetici" motto="Mekanlarınızı Yönetin!" />
      {venues.isError ? (
        <p>
          <strong>Birşeyler ters gitti! ...</strong>
        </p>
      ) : venues.isLoading ? (
        <p>
          <strong>Mekanlar Yükleniyor ...</strong>
        </p>
      ) : (
        venues.isSuccess && (
          <div className="row">
            <VenueList
              venues={venues.data}
              admin={true}
              onClick={handleClick}
            />
          </div>
        )
      )}
    </>
  );
}

export default Admin;
