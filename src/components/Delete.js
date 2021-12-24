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
                        backgroundColor: 'transparent',
                    },
                    content: {
                        backgroundColor: 'black',
                        position: 'fixed',
                        left: '37%',
                        top: '20%',
                        width: '26%',
                        height: '330px',
                        border: '2px darkgray solid',
                        paddingLeft:'5px'
                    }
                }}
            >
                <div className={styles.modalstyle}>
                    <span onClick={ModalExit}>
                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'white', fontSize: '20px' }} /></span>
                    <img src={DataObj.AttachmentURL} />
                    <p className={styles.modaltext}>{DataObj.text}</p>
                    <button className={styles.delete}onClick={Delete}>삭제하기</button>
                </div>
            </Modal> : null}


        </div>
    )
}
export default Delete;