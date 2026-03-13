import { advisors } from "./cards/advisor.js";
import AdvisorCard from "./cards/AdvisorCard.jsx";

const AdvisorCardsContainer = () => (
  <div className="grid">
    {advisors.map(advisor => (
      <AdvisorCard key={advisor.id} advisor={advisor} />
    ))}
  </div>
);

export default AdvisorCardsContainer;   