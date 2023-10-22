export default function StatementIDPage({ params }) {
    const statementID = params.statementID;
    console.log(statementID);
    return (
        <main className="flex justify-center items-center bg-white">
            <div className="h-full overflow-auto max-w-[840px] py-12">
                <div className="flex flex-col gap-6 p-8">
                    <h1 className="mb-4">Your Statement of Advice</h1> 
                    <div className="grid grid-rows-2 grid-cols-2 gap-4 mb-8">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium text-slate-700">Date of Advice:</div>
                            <div className="">15th Aug 2023</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2"></div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium text-slate-700">Prepared for:</div>
                            <div className="">User Name</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium text-slate-700">Prepared by:</div>
                            <div className="">Palladian</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="heading-h4-size">About this Statement</h4>
                        <p className="paragraph statement-about">
                        This Statement of Advice (SOA) sets out our advice to you in
                        relation to your ongoing share investment objectives. The advice
                        is given in accordance with your Investment Profile.
                        <br />‍<br />
                        You may access your Investment Profile <a href="">here</a>. If
                        any information has changed this advice may no longer be
                        appropriate.
                        <br />
                        <br />
                        This advice is current for 30 days from the above &#x27;date of
                        advice&#x27;, after which it will expire. You should, therefore,
                        not rely on this advice after 30 days.
                        </p>
                    </div>
                    <div>
                        <h4 className="heading-h4-size">Scope of Advice</h4>
                        <p className="paragraph statement-scope">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros elementum tristique. Duis cursus,
                        mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
                        libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
                        lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </p>
                    </div>
                    <div>
                        <h4 className="heading-h4-size">Summary of Advice</h4>
                        <p className="paragraph statement-summary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros elementum tristique. Duis cursus,
                        mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
                        libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
                        lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </p>
                    </div>
                    <div>
                        <h4 className="heading-h4-size">Summary of Advice</h4>
                        <p className="paragraph statement-scope">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros elementum tristique. Duis cursus,
                        mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
                        libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
                        lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
