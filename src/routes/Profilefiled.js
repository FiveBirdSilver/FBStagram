import React, { useState, useEffect } from "react";
import { dbService } from "../myBase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc } from "firebase/firestore";
import styles from "../css/profile.module.css";
import Delete from "components/Delete";


function Profilefiled({ UserObj }) { // UserObj : (현재 로그인된) 사용자의 정보
    const [Photo, setPhoto] = useState([]); // 불러오는 값
    const [PhotoClick, setPhotoClick] = useState(false);
    const [ClickUrl, setClickUrl] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [Space, setSpace] = useState(false);

    const Click = (e) => {
        console.log(e.target.src)
        setClickUrl(e.target.src);
        setPhotoClick(prev => !prev);
        setModalIsOpen(true);
    }

    useEffect(() => { // 페이지가 로드되는 순간 
        const q = query(collection(dbService, "fbstagram"), where("creatorID", "==", UserObj.uid), orderBy("time", "desc")); // collection을 작성한 시간 순서대로 내림차순으로 불러오기
        onSnapshot(q, (snapshot) => {
            const PhotoArr = snapshot.docs.map((doc) => ({ //PhotoArr에 실시간으로 데이터를 넣어줌
                id: doc.id,
                ...doc.data()
            }));
            setPhoto(PhotoArr);
            if(PhotoArr == '' || null || undefined || 0 || NaN){
                setSpace(true);      
                console.log("Dd")          
            }
        });
    }, [UserObj]);

    return (
        <>

            {Space ? <span className={styles.guide}>지금 홈 화면에서 오늘을 기록해<br/>나의 공간을 하나씩 채워보세요 :)</span> : null}
            <div className={styles.photocontain}>
                {Photo.map((e) =>  <div key={e.id}>
                    <img src={e.AttachmentURL} onClick={Click} />
                    {PhotoClick && (e.AttachmentURL == ClickUrl) ?
                        <Delete DataObj={e} />
                      : null}</div>
                )}
            </div> 
            


        </>
    )
}
export default Profilefiled;
