//declare
import dayjs from "dayjs";
import React, {useState, useEffect} from "react";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/images/icon-delete.svg";
import ModalDelete from "../Modals/ModalDelete";
import "dayjs/locale/id";
import ModalToast from "../Modals/ModalToast";
import { Creators as TodoActions } from "../../redux/TodoRedux";
import emptyItem from "../../assets/images/empty-activity.png";

function DashboardModule(){
    const history = useNavigate();
    const dispatch = useDispatch();
    const getActivities = () => dispatch(TodoActions.getActivitiesRequest());
    const addActivtiy = (data) => dispatch(TodoActions.addActivityRequest(data));
    const resetState = () => dispatch(TodoActions.resetStateTodo());
    const {
        dataGetActivities,
        errGetActivities,
        isLoadingGetActivities,
        dataAddActivity,
        errAddActivity,
        dataDeleteActivity,
        errDeleteActivity,
        isLoadingAddActivity,
    } = useSelector((state) => state.todo);
    const [showDelete, setShowDelete] = useState(false);
    const [modalText, setModalText] = useState("Activity berhasil dihapus");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("danger");
    const [deletedActivity, setDeletedActivity] = useState("");
    useEffect(() =>{
        if(errAddActivity !== null){
            setShowToast(true);
            setToastType("danger");
            errAddActivity
                ? setModalText(errAddActivity)
                : setModalText("Gagal Menambahkan Aktivitas");
            resetState()
        }
        if(dataAddActivity){
            getActivities()
            resetState()
        }
    }, [errAddActivity, dataAddActivity]);

    useEffect(() =>{
        if(errGetActivities !== null){
            setShowToast(true);
            setToastType("danger");
            errAddActivity
                ? setModalText(errGetActivities)
                : setModalText("Something Wrong, Gagal Memuat List Aktivitas");
            resetState()
        }
    }, [errGetActivities])

    useEffect(() =>{
        if(errDeleteActivity !== null){
            setShowToast(true);
            setToastType("danger");
            errAddActivity
                ? setModalText(errDeleteActivity)
                : setModalText("Gagal Menghapus  Aktivitas");
            resetState()
        }
        if(dataDeleteActivity){
            getActivities();
            setShowToast(true);
            setToastType("success");
            setModalText("Aktivitas Berhasi Di Hapus");
            resetState()
        }
    }, [errDeleteActivity, dataDeleteActivity]);

    const handleAddActivity = () =>{
        addActivtiy({ title:"New Activity", email : "giriadam67@gmail.com"});
    }

    const handleClickDelete = (item) => {
        setShowDelete(true);
        setModalText(
          `<p>Apakah anda yakin menghapus activity <strong>“${item?.title}”</strong>?</p>`
        );
        setDeletedActivity(item?.id);
      };

    return (
        <div className="container">
      <div className="todo-header">
        <h1 data-cy="activity-title">Activity</h1>
        <button className="btn btn-primary" data-cy="activity-add-button" onClick={handleAddActivity}>
          {isLoadingAddActivity ? (
            <Spinner
              as="span"
              animation="border"
              size="md"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <>
              <span className="icon-plus"></span> {"Tambah"}
            </>
          )}
        </button>
      </div>
      <div className="dashboard-content">
        {isLoadingGetActivities ? (
          <div className="spinner-wrapper">
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="row">
            {
              dataGetActivities?.data?.length < 1 &&
              <div className="empty-item" data-cy="activity-empty-state">
                <img src={emptyItem} alt="empty" onClick={handleAddActivity} />
              </div>
            }
            {dataGetActivities?.data?.map((item, key) => (
              <div key={item?.id} className="col-3">
                <div className="activity-card" data-cy="activity-item" id={`itemTodo${key}`}>
                  <div
                    className="activity-body"
                    onClick={() => history.push(`/detail/${item?.id}`)}
                  >
                    <h4 data-cy="activity-item-title">{item?.title}</h4>
                  </div>
                  <div className="card-footer">
                    <span data-cy="activity-item-date">
                      {dayjs(item?.created_at)
                        .locale("id")
                        .format("DD MMMM YYYY")}
                    </span>
                    <img
                      src={deleteIcon}
                      onClick={() => handleClickDelete(item)}
                      alt="delete"
                      data-cy="activity-item-delete-button"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ModalDelete
        text={modalText}
        show={showDelete}
        deletedItem={deletedActivity}
        handleClose={() => setShowDelete(false)}
      />
      <ModalToast
        type={toastType}
        text={modalText}
        show={showToast}
        handleClose={() => setShowToast(false)}
      />
    </div>
    );
}
export default DashboardModule;