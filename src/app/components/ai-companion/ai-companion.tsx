import { AICompanionProvider } from "./AICompanionState";
import AICompanionPopup from "./ai-companion-popup";
import AICompanionTrigger from "./ai-companion-trigger";

export default function AICompanion() {

    return (
        <AICompanionProvider>
            <AICompanionPopup>
                <AICompanionTrigger />
            </AICompanionPopup>
        </AICompanionProvider>
    )
}