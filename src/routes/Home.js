import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../myBase";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, doc, serverTimestamp, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import styles from "../css/Home.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faImages, faHeart } from "@fortawesome/free-regular-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom";
import userimg from "../image/user.png";


function Home({ UserObj, DataObj }) { // UserObj : (현재 로그인된) 사용자의 정보
    const [Store, setStore] = useState(""); // 저장하는 값
    const [Call, setCall] = useState([]); // 불러오는 값
    const [Attachment, setAttachment] = useState(""); // 업로드한 파일의 이미지 url이 담겨있음
    const [addfiled, setaddfiled] = useState(false);

    const change = (e) => {
        const { value } = e.target;
        setStore(value);
    }

    const submit = async (e) => { //input에 입력하고 폼을 넘기는 순간
        e.preventDefault();
        let AttachmentURL = "";
        if (Attachment !== "") {
            const fileRef = ref(storageService, `${UserObj.uid}/${uuidv4()}`);
            const uploadfile = await uploadString(fileRef, Attachment, "data_url");
            AttachmentURL = await getDownloadURL(uploadfile.ref) // 업로드한 사진을 다운받기 위함
        }
        let DataObj = {
            text: Store,
            time: serverTimestamp(),
            creatorID: UserObj.uid, //document에 내용, 작성한시간, 작성한 유저의 고유 아이디를 저장
            creatorEmail:UserObj.email,
            profilephoto:UserObj.photoURL,
            AttachmentURL,
        }
        await addDoc(collection(dbService, "fbstagram"), DataObj); // could firestore의 컬렉션에 저장되는 문서의 데이터를 저장. 이를 위해여, 컬렉션과 문서를 생성했음
        setStore("");
        setAttachment("");
        let a =[];
        if(a.map((ae) => ae.Call.map((e)=> e.creatorID) == UserObj.uid)) {
            console.log(Call.map((e)=> e.creatorEmail))
        }
       
    }

    useEffect(() => { // 페이지가 로드되는 순간 
        const q = query(collection(dbService, "fbstagram"), orderBy("time", "desc")); // collection을 작성한 시간 순서대로 내림차순으로 불러오기
        onSnapshot(q, (snapshot) => {
            const CallArr = snapshot.docs.map((doc) => ({ //CallArr에 실시간으로 데이터를 넣어줌
                id: doc.id,
                ...doc.data()
            }));
            setCall(CallArr);
     
        });
    }, [UserObj]);

    const FileUpload = (event) => {
        const { files } = event.target;
        const theFile = files[0]; // 기본적으로 많은 파일을 원하는 만큼 가질수 있는데, input을 하나만 받을 것이기 때문에 [0]
        const reader = new FileReader(); // 파일의 내용을 일고 사용자의 컴퓨터에 저장하는 것을 가능케 해주는 API
        reader.onloadend = (finishedEvent) => { // 파일이 업로드 하면 이미지를 가공하거나 확인하는 작업을 위해 event를 Listening 하고 있어햐 함.
                                                 // 파일이 로드 되는 것이 끝나면, 즉 파일을 전부 읽었을 경우
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const ClearAttachment = () => { // 파일 첨부 취소
        setAttachment(null);
        setStore("");
    }
    const addbtn = () => {
        setaddfiled(prev => !prev);
    }
    return (
        <div className={styles.contain}>
            <div className={styles.containwrap}>
                <h1 className={styles.title}>FBStagram</h1>
                <button className={styles.addbtn} onClick={addbtn}><FontAwesomeIcon icon={faPlusSquare}
                    style={{ color: 'white', fontSize: '22px' }} /></button>
                <Link to={"/"}><button className={styles.myprofilebtn}><FontAwesomeIcon icon={faUser}
                    style={{ color: 'white', fontSize: '20px' }} /></button></Link>
            </div>
            {addfiled
                ?
                <form className={styles.upload} onSubmit={submit}>
                    <div className={styles.filentext}>
                        {Attachment ? <img className={styles.fileattach} src={Attachment} width="50px" /> :
                            <> <label className={styles.file} htmlFor="inputfile"><FontAwesomeIcon icon={faImages}
                                style={{ color: 'white', fontSize: '30px' }} /></label>
                                <input id="inputfile" type="file" accept="image/*" onChange={FileUpload}
                                    style={{ display: 'none' }} required/></>
                        }
                        <p> </p>
                        <textarea className={styles.text}
                            style={{ paddingLeft: '10px', paddingTop:'5px', height:'85px'}}
                            
                            value={Store}
                            placeholder="오늘을 기록해보세요"
                            onChange={change}
                            required
                        />
                    </div>
                    <div className={styles.deletenpost}>
                        <button className={styles.post} onClick={ClearAttachment}>취소하기</button>
                        <p></p>
                        <input className={styles.post} type="submit" value="게시하기" />
                    </div>
                </form> :
                null
            }
            <div>
                {Call.map((e) => 
                    <div key={e.id} className={styles.homefiled}>
                        <div className={styles.userinfo}>
                            {e.profilephoto ? <img style={{
                                width: '30px', height: '30px',
                                borderRadius: '50%'
                            }} src={e.profilephoto} /> :  <img style={{
                                width: '30px', height: '30px',
                                borderRadius: '50%'
                            }} src={userimg} /> }
                            
                            <span className={styles.homefiledspan}>{e.creatorEmail}</span>
                        </div>
                        <img src={e.AttachmentURL} />
                        <span className={styles.homefiledspan}>{e.text}</span>
                    </div>
                )}
            </div>

                            
            <h3 style={{fontSize:'11px'}}>FiveBirdSilver ⓒ 2021 All rights reserved.</h3>
        </div>
    )
}
export default Home;
