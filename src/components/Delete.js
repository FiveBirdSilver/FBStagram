import react, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../myBase";
import styles from "../css/profile.module.css";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons"

function Delete({ DataObj }) {
    const [modalIsOpen, setModalIsOpen] = useState(true);

    const ModalExit = () => {
        setModalIsOpen(false);
    }

    const Delete = async () => {
        const ok = window.confirm("정말 삭제 하시겠습니까?");
        if (ok) {
            await deleteDoc(doc(dbService, "fbstagram", `${DataObj.id}`));
        }
    }
    return (
        <div>
            {modalIsOpen ? <Modal isOpen={true} ariaHideApp={false}
                className={styles.modal}
                style={{
                    overlay: {
                        backgroundColor:'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    content: {
                        backgroundColor: 'black',
                        position:'fixed',
                        height: '330px',
                        width:'auto',
                        border: '2px darkgray solid',
                        padding: '5px 10px 0 10px',
                    }
                }}
            >
                <div className={styles.modalstyle}>
                    <span onClick={ModalExit}>
                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'white', fontSize: '20px' }} /></span>
                    <img src={DataObj.AttachmentURL} />
                    <p className={styles.modaltext}>{DataObj.text}</p>
                    <button className={styles.delete} onClick={Delete}>삭제하기</button>
                </div>
            </Modal> : null}


        </div>
    )
}
export default Delete;