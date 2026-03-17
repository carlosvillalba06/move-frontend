import { Children } from "react";
import AdviserNavbar from "../AdviserNavbar";

const AdviserLayout = ({}) =>{

    return(

        <div className="adviser-layout">
            <AdviserNavbar  />

            <main className="adviser-content">
                {Children}
            </main>

        </div>
    );
    
};

export default AdviserLayout;