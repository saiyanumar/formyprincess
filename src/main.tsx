import { createRoot } from "react-dom/client";
import { useState } from 'react';
import App from "./App.tsx";
import FullscreenGate from '@/components/FullscreenGate';
import "./index.css";
import { Analytics } from "@vercel/analytics/next"

function Root() {
	const [showFullscreen, setShowFullscreen] = useState(true);

	if (showFullscreen) {
		return <FullscreenGate onFullscreen={() => setShowFullscreen(false)} />;
	}

	return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
