import { AICompanionProvider } from "./AICompanionState";
import AICompanionTrigger from "./ai-companion-trigger";

export default function AICompanion() {

    return (
        <AICompanionProvider>
            <AICompanionTrigger />
        </AICompanionProvider>
    )
}