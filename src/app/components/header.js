import styles from "./header.module.css";

export default function Header({ currentPage }) {
  const today = new Date().toUTCString().slice(5, 16);


  return (
    <div className={styles["main-container"]}>
      <div className="container-default w-container">
        <div className={styles["container"]}>
          <div className={styles["left-content"]}>
            <div className="mg-right-24px">
              <div className="text-400 medium color-neutral-800">{currentPage}</div>
            </div>
            <div>{today}</div>
          </div>
          <div className={styles["right-content"]}>
            <a
              href="/utility-pages/notifications"
              className="notification-container w-inline-block"
            >
              <div className="custom-icon"></div>
            </a>
            <div
              data-hover="true"
              data-delay="0"
              data-w-id="b5a11493-9e48-7ef8-19ef-456f41cdbd81"
              className={styles["dropdown-wrapper"]}
            >
              <div className={styles["dropdown-toggle"]}>
                <img
                  src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc2_john-carter-nav-avatar-dashboardly-webflow-template.jpg"
                  loading="eager"
                  alt="John Carter - Dashly X Webflow Template"
                  className="avatar-circle _02 mg-right-8px"
                />
                <div className="hidden-on-mbl">
                  <div className="mg-bottom-4px">
                    <div className="text-200 medium color-neutral-800">
                      John Carter
                    </div>
                  </div>
                </div>
                <form action="/auth/signout" method="post">
                  <button className={styles["logout-icon"]} type="submit">
                    
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
