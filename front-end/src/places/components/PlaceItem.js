import React, { useState, useContext } from "react";

import Modal from "../../shared/components/UiElement/Modal/Modal";
import Card from "../../shared/components/UiElement/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import Map from "../../shared/components/UiElement/Map/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UiElement/ErrorModal/ErrorModal";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const canceldeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `process.env.REACT_APP_BACKEND_UR/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Baerer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoome={5} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={canceldeleteHandler}
        header="Are you sure ?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={canceldeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place ? Please note that it
          can`t be undone thereafter.
        </p>
      </Modal>
      <Card>
        {isLoading && <LoadingSpinner asOverlay />}
        <li className="place-item">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_ASSETS_BACKEND_URL}${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </li>
      </Card>
    </>
  );
};

export default PlaceItem;
