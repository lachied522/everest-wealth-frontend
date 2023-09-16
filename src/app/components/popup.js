import styles from "./popup.module.css";

export default function Popup({ title, closePopup, children }) {

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["popup"]}>
                <div
                    className={styles["close-button"]}
                    onClick={closePopup}
                >
                    
                </div>
                <div className="display-4 mg-bottom-32px">
                    {title}
                </div>
                {children}
            </div>
        </div>
    )
}
