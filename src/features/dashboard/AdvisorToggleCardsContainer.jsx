import SearchBar from "../../components/SearchBar.jsx";
import { advisors } from "./cards/advisor.js";
import AdvisorToggleCard from "./cards/AdvisorToggleCard.jsx";

const AdvisorCardsToggleContainer = () => {

    return (

        <div>


            <SearchBar/>
            <br />
            <div className="grid">
                {advisors.map(advisor => (
                    <AdvisorToggleCard key={advisor.id} advisor={advisor} />
                ))}
            </div>
        </div>

    )

};

export default AdvisorCardsToggleContainer;   