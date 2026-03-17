const AdviserNavbar = ({ }) => {

    return (

        <header>


            <div className="navbar-left">

                <img
                    src={logoMove}
                    alt="Logo"
                    className="navbar-logo"
                />

                {advisorName && (
                    <span className="advisor-name">
                        Tablero de {advisorName}
                    </span>
                )}

            </div>

            <div className="navbar-right">

                <div className="user-circle">
                    <img
                        src={userMove}
                        alt="User"
                    />

                </div>

            </div>

        </header>

    );

};

export default AdviserNavbar;