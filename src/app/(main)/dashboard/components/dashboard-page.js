"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "src/app/(main)/context/GlobalState";
import NewPortfolioPopup from "@/components/new-portfolio-popup";

export default function DashboardPage() {
    const { session, portfolioData } = useGlobalContext();
    const [currentPortfolio, setCurrentPortfolio] = useState(null); //keeps track of current portfolio being viewed
    const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
    const [newPortfolioPopupOpen, setNewPortfolioPopupOpen] = useState(false);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        setCurrentPortfolio(portfolioData[0]);
        setTotalValue(portfolioData? portfolioData[0].data?.reduce((acc, obj) => acc + parseFloat(obj.value), 0): 0);
    }, [portfolioData]);

    const openNewPortfolioPopup = () => {
        setNewPortfolioPopupOpen(true);
    }

    const togglePortfolioDropdown = () => {
        setPortfolioDropdownOpen(!portfolioDropdownOpen);
    }

    const selectPortfolio = (p) => {
        setCurrentPortfolio(p);
        setPortfolioDropdownOpen(false);
    }
    
    return (
        <div className="container-default w-container">
            <NewPortfolioPopup 
                isOpen={newPortfolioPopupOpen}
                setIsOpen={setNewPortfolioPopupOpen}
                session={session}
            />
            <div
                data-w-id="56bd30ef-cb82-658f-d493-6d640ecf97f0"
                className="mg-bottom-40px"
            >
            <div className="grid-2-columns _2-col-mbl _1-col-mbp">
                <div className="flex align-center">
                    <div id="w-node-d824fe58-9d11-82a3-5bd0-f6415558c652-2fdc3fd8">
                        <h1 className="heading-h4-size mg-bottom-8px">My Portfolio</h1>
                        <div className="text-400">subtext</div>
                    </div>
                    <div
                        data-hover="false"
                        data-delay="0"
                        className="dropdown-wrapper w-dropdown"
                    >
                        <div className="dropdown-toggle w-dropdown-toggle" onClick={togglePortfolioDropdown}>
                            <div className="line-rounded-icon w-icon-dropdown-toggle" />
                        </div>
                        {portfolioDropdownOpen && (
                            <div className="dropdown-column-wrapper w-dropdown-list w--open">
                            {portfolioData.map(p => (
                                <a 
                                    className="w-dropdown-link" 
                                    key={p.id}
                                    onClick={() => {selectPortfolio(p)}}
                                >
                                    {p.name}
                                </a>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    className="btn-primary w-button"
                    onClick={openNewPortfolioPopup}
                >
                    <span className="line-rounded-icon link-icon-left"></span>New
                    Portfolio
                </button>
            </div>
            </div>
            <div className="reports-top-details-container">
            <div
                id="w-node-_189a64fb-05bb-b2aa-4063-67cbe8bd4d4f-2fdc3fd8"
                data-w-id="189a64fb-05bb-b2aa-4063-67cbe8bd4d4f"
                className="module reports-top-details"
            >
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc9_users-icon-dashboardly-webflow-template.svg"
                loading="eager"
                alt="Users - Dashly X Webflow Template"
                className="reports-top-details-icon"
                />
                <div>
                <div className="text-200 medium">Objective</div>
                <div className="flex align-end">
                    <div className="text-100 bold color-neutral-800">{currentPortfolio?.objective}</div>
                </div>
                </div>
            </div>
            <div
                id="w-node-_15bcd904-cca9-3107-d162-2cf33da79d40-2fdc3fd8"
                data-w-id="15bcd904-cca9-3107-d162-2cf33da79d40"
                className="module reports-top-details"
            >
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc6_pageviews-icon-dashboardly-webflow-template.svg"
                loading="eager"
                alt="Pageviews - Dashly X Webflow Template"
                className="reports-top-details-icon"
                />
                <div>
                <div className="text-200 medium">Value</div>
                <div className="flex align-end">
                    <div className="display-4 mg-right-6px">{`$${totalValue?.toLocaleString()}`}</div>
                    <div className="text-100 medium mg-bottom-4px">
                    </div>
                </div>
                </div>
            </div>
            <div
                id="w-node-_80250c7f-9d0b-c675-8fdf-c4c1d780000b-2fdc3fd8"
                data-w-id="80250c7f-9d0b-c675-8fdf-c4c1d780000b"
                className="module reports-top-details"
            >
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc8_new-signups-icon-dashboardly-webflow-template.svg"
                loading="eager"
                alt="New Sign Ups - Dashly X Webflow Template"
                className="reports-top-details-icon"
                />
                <div>
                <div className="text-200 medium">Week return</div>
                <div className="flex align-end">
                    <div className="display-4 mg-right-6px">4.5K</div>
                    <div className="text-100 medium mg-bottom-4px">
                    <div className="flex">
                        <div className="color-red-300">3.1% </div>
                        <div className="custom-icon font-size-10px color-red-300">
                        
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div
                id="w-node-_98d9c2d1-c1b4-226d-dbcc-f9bf7d5abdc9-2fdc3fd8"
                data-w-id="98d9c2d1-c1b4-226d-dbcc-f9bf7d5abdc9"
                
                className="module reports-top-details"
            >
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc7_subscriptions-icon-dashboardly-webflow-template.svg"
                loading="eager"
                alt="Subscriptions - Dashly X Webflow Template"
                className="reports-top-details-icon"
                />
                <div>
                <div className="text-200 medium">Total return</div>
                <div className="flex align-end">
                    <div className="display-4 mg-right-6px">3.3K</div>
                    <div className="text-100 medium mg-bottom-4px">
                    <div className="flex">
                        <div className="color-green-300">11.3% </div>
                        <div className="custom-icon font-size-10px color-green-300">
                        
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div
            data-w-id="e5b429b5-439c-5fd1-b6c6-cc7ec4d25785"
            
            className="module graph-large"
            >
            <div className="grid-2-columns _2-col-mbl _1-col-mbp">
                <div className="text-300 bold color-neutral-800">Monthly pageviews</div>
                <div id="w-node-_9e0982af-7013-efb2-9f4a-6038634a187a-2fdc3fd8">
                <div
                    data-hover="true"
                    data-delay="0"
                    data-w-id="9e0982af-7013-efb2-9f4a-6038634a187b"
                    className="dropdown-wrapper module-dropdown w-dropdown"
                >
                    <div className="dropdown-toggle color-neutral-600 w-dropdown-toggle">
                    <div className="text-100 medium">This month</div>
                    <div className="line-rounded-icon dropdown-arrow module-dropdown">
                        
                    </div>
                    </div>
                    <nav className="dropdown-column-wrapper module-dropdown w-dropdown-list">
                    <div>
                        <div className="w-layout-grid grid-1-column dropdown-link-column">
                        <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                        >
                            This week
                        </a>
                        <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                        >
                            This month
                        </a>
                        <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                        >
                            This year
                        </a>
                        </div>
                    </div>
                    </nav>
                </div>
                </div>
            </div>
            <div className="divider top-20px---bottom-52px"></div>
            <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4096_reports-graph-1-dashboardly-webflow-template.png"
                loading="eager"
                sizes="(max-width: 479px) 100vw, (max-width: 767px) 85vw, (max-width: 991px) 88vw, (max-width: 1439px) 76vw, 970px"
                srcSet="
                        https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4096_reports-graph-1-dashboardly-webflow-template-p-500.png   500w,
                        https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4096_reports-graph-1-dashboardly-webflow-template-p-800.png   800w,
                        https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4096_reports-graph-1-dashboardly-webflow-template-p-1080.png 1080w,
                        https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4096_reports-graph-1-dashboardly-webflow-template.png        1940w
                    "
                alt="Monthly Page Views - Dashly X Webflow Template"
            />
            </div>
            <div className="grid-3-columns reports-graphs">
            <div
                id="w-node-ee74cfef-a4b6-95e5-1b61-2e60cce252f7-2fdc3fd8"
                data-w-id="ee74cfef-a4b6-95e5-1b61-2e60cce252f7"
                
                className="module graph"
            >
                <div className="grid-2-columns _2-col-mbl gap-0">
                <div id="w-node-_42657933-fa9c-6e29-0562-e217a4a98906-2fdc3fd8">
                    <div className="heading-h3-size">50.8K</div>
                    <div className="text-200">Pageviews</div>
                </div>
                <div
                    id="w-node-_343314ff-e1a8-6c04-2c43-a03ddc6426c6-2fdc3fd8"
                    className="text-100 medium flex"
                >
                    <div className="color-green-300">28.5% </div>
                    <div className="custom-icon font-size-10px color-green-300"></div>
                </div>
                </div>
                <div className="divider top-28px---bottom-36px bg-neutral-300"></div>
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4054_reports-graph-2-dashboardly-webflow-template.png"
                loading="eager"
                alt="Page Views - Dashly X Webflow Template"
                />
            </div>
            <div
                id="w-node-_36308f34-03f8-8bf4-73a9-3d940f79128f-2fdc3fd8"
                data-w-id="36308f34-03f8-8bf4-73a9-3d940f79128f"
                
                className="module graph"
            >
                <div className="grid-2-columns _2-col-mbl gap-0">
                <div id="w-node-_36308f34-03f8-8bf4-73a9-3d940f791291-2fdc3fd8">
                    <div className="heading-h3-size">23.6K</div>
                    <div className="text-200">Users</div>
                </div>
                <div
                    id="w-node-_36308f34-03f8-8bf4-73a9-3d940f791296-2fdc3fd8"
                    className="text-100 medium flex"
                >
                    <div className="color-green-300">28.5% </div>
                    <div className="custom-icon font-size-10px color-green-300"></div>
                </div>
                </div>
                <div className="divider top-28px---bottom-36px bg-neutral-300"></div>
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcb_reports-graph-3-dashboardly-webflow-template.png"
                loading="eager"
                alt="Users - Dashly X Webflow Template"
                />
            </div>
            <div
                id="w-node-b0e00774-229d-3cc3-1106-346a087c649b-2fdc3fd8"
                data-w-id="b0e00774-229d-3cc3-1106-346a087c649b"
                
                className="module graph"
            >
                <div className="grid-2-columns _2-col-mbl gap-0">
                <div id="w-node-b0e00774-229d-3cc3-1106-346a087c649d-2fdc3fd8">
                    <div className="heading-h3-size">4.5K</div>
                    <div className="text-200">New sign ups</div>
                </div>
                <div
                    id="w-node-b0e00774-229d-3cc3-1106-346a087c64a2-2fdc3fd8"
                    className="text-100 medium flex"
                >
                    <div className="color-red-300">3.1% </div>
                    <div className="custom-icon font-size-10px color-red-300"></div>
                </div>
                </div>
                <div className="divider top-28px---bottom-36px bg-neutral-300"></div>
                <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4055_reports-graph-4-dashboardly-webflow-template.png"
                loading="eager"
                alt="New Sign Ups - Dashly X Webflow Template"
                />
            </div>
            </div>
            <div className="grid-2-columns reports-modules">
            <div
                id="w-node-_3254a631-302e-b14f-4a98-005e8a612242-2fdc3fd8"
                data-w-id="3254a631-302e-b14f-4a98-005e8a612242"
                
                className="module users-by-device"
            >
                <div className="grid-2-columns _2-col-mbl _1-col-mbp">
                <div className="text-300 bold color-neutral-800">Users by device</div>
                <div id="w-node-_8af7a147-f590-4f49-47d6-21e56df9c287-2fdc3fd8">
                    <div
                    data-hover="true"
                    data-delay="0"
                    data-w-id="c833eacd-17f1-2473-ac6b-2ed66337b458"
                    className="dropdown-wrapper module-dropdown w-dropdown"
                    >
                    <div className="dropdown-toggle color-neutral-600 w-dropdown-toggle">
                        <div className="text-100 medium">This month</div>
                        <div className="line-rounded-icon dropdown-arrow module-dropdown">
                        
                        </div>
                    </div>
                    <nav className="dropdown-column-wrapper module-dropdown w-dropdown-list">
                        <div>
                        <div className="w-layout-grid grid-1-column dropdown-link-column">
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This week
                            </a>
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This month
                            </a>
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This year
                            </a>
                        </div>
                        </div>
                    </nav>
                    </div>
                </div>
                </div>
                <div className="divider _24px bg-neutral-300"></div>
                <div className="inner-container _430px center">
                <img
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcc_users-by-device-circle-graph-dashboardly-webflow-template.png"
                    loading="eager"
                    sizes="(max-width: 479px) 100vw, (max-width: 767px) 78vw, (max-width: 991px) 43vw, (max-width: 1439px) 37vw, 430px"
                    srcSet="
                            https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcc_users-by-device-circle-graph-dashboardly-webflow-template-p-500.png 500w,
                            https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcc_users-by-device-circle-graph-dashboardly-webflow-template.png       864w
                        "
                    alt="Users By Device - Dashly X Webflow Template"
                />
                </div>
            </div>
            <div
                id="w-node-_1ddcb99f-332b-3b7b-cf16-ec4fc0b0f67f-2fdc3fd8"
                data-w-id="1ddcb99f-332b-3b7b-cf16-ec4fc0b0f67f"
                
                className="module recent-contacts"
            >
                <div className="grid-2-columns _2-col-mbl _1-col-mbp">
                <div className="text-300 bold color-neutral-800">Recent contacts</div>
                <div id="w-node-_1ddcb99f-332b-3b7b-cf16-ec4fc0b0f683-2fdc3fd8">
                    <div
                    data-hover="true"
                    data-delay="0"
                    data-w-id="1ddcb99f-332b-3b7b-cf16-ec4fc0b0f684"
                    className="dropdown-wrapper module-dropdown w-dropdown"
                    >
                    <div className="dropdown-toggle color-neutral-600 w-dropdown-toggle">
                        <div className="text-100 medium">This month</div>
                        <div className="line-rounded-icon dropdown-arrow module-dropdown">
                        
                        </div>
                    </div>
                    <nav className="dropdown-column-wrapper module-dropdown w-dropdown-list">
                        <div>
                        <div className="w-layout-grid grid-1-column dropdown-link-column">
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This week
                            </a>
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This month
                            </a>
                            <a
                            href="#"
                            className="dropdown-link text-100 w-dropdown-link"
                            >
                            This year
                            </a>
                        </div>
                        </div>
                    </nav>
                    </div>
                </div>
                </div>
                <div className="divider _24px bg-neutral-300"></div>
                <div className="flex align-center">
                <img
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fce_sophie-moore-avatar-small-dashboardly-webflow-template.jpg"
                    loading="eager"
                    alt="Sophie Moore - Dashly X Webflow Template"
                    className="avatar-circle _02 mg-right-10px"
                />
                <div className="recent-contacts-details-container">
                    <div className="mg-right-16px">
                    <div className="text-200 medium color-neutral-800">
                        Sophie Moore
                    </div>
                    </div>
                    <a
                    href="mailto:contact@sophiemoore.com"
                    className="mg-left-auto mg-left-0-mbp text-decoration-none w-inline-block"
                    >
                    <div className="text-200">contact@sophiemoore.com</div>
                    </a>
                </div>
                </div>
                <div className="divider _20px bg-neutral-300"></div>
                <div className="flex align-center">
                <img
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcf_matt-cannon-avatar-small-dashboardly-webflow-template.jpg"
                    loading="eager"
                    alt="Matt Cannon - Dashly X Webflow Template"
                    className="avatar-circle _02 mg-right-10px"
                />
                <div className="recent-contacts-details-container">
                    <div className="mg-right-16px">
                    <div className="text-200 medium color-neutral-800">
                        Matt Cannon
                    </div>
                    </div>
                    <a
                    href="mailto:contact@mattcannon.com"
                    className="mg-left-auto mg-left-0-mbp text-decoration-none w-inline-block"
                    >
                    <div className="text-200">contact@mattcannon.com</div>
                    </a>
                </div>
                </div>
                <div className="divider _20px bg-neutral-300"></div>
                <div className="flex align-center">
                <img
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fcd_andy-smith-avatar-small-dashboardly-webflow-template.jpg"
                    loading="eager"
                    alt="Andy Smith - Dashly X Webflow Template"
                    className="avatar-circle _02 mg-right-10px"
                />
                <div className="recent-contacts-details-container">
                    <div className="mg-right-16px">
                    <div className="text-200 medium color-neutral-800">
                        Andy Smith
                    </div>
                    </div>
                    <a
                    href="mailto:contact@andysmith.com"
                    className="mg-left-auto mg-left-0-mbp text-decoration-none w-inline-block"
                    >
                    <div className="text-200">contact@andysmith.com</div>
                    </a>
                </div>
                </div>
                <div className="divider _20px bg-neutral-300"></div>
                <div className="flex align-center">
                <img
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fd0_lily-woods-avatar-small-dashboardly-webflow-template.jpg"
                    loading="eager"
                    alt="Lily Woods - Dashly X Webflow Template"
                    className="avatar-circle _02 mg-right-10px"
                />
                <div className="recent-contacts-details-container">
                    <div className="mg-right-16px">
                    <div className="text-200 medium color-neutral-800">
                        Lily Woods
                    </div>
                    </div>
                    <a
                    href="mailto:contact@lilywoods.com"
                    className="mg-left-auto mg-left-0-mbp text-decoration-none w-inline-block"
                    >
                    <div className="text-200">contact@lilywoods.com</div>
                    </a>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}
