class FairMetrics extends HTMLElement {
	constructor() {
		super();

		//get data
		const data = this.metrics;
		if (
			data &&
			Array.isArray(JSON.parse(data)) &&
			JSON.parse(data).length == 4
		) {
			const metricsData = JSON.parse(data);

			const width = this.width;
			

			const fcolor = "#06aed5";
			const acolor = "#f0c808";
			const icolor = "#59cd90";
			const rcolor = "#e23b49";
			const nullcolor = "#eaeaea";

			const findable = `<tspan style='color:${fcolor}'>Findable</tspan> : ${metricsData[0]*100}%`;
			const accessible = `<tspan style='color:${acolor}'>Accessible</tspan> : ${metricsData[1]*100}%`;
			const interoperable = `<tspan style='color:${icolor}'>Interoperable</tspan> : ${metricsData[2]*100}%`;
			const reusable = `<tspan style='color:${rcolor}'>Reusable</tspan> : ${metricsData[3]*100}%`;

			//define tooltip
			const widgetTooltip = document.createElement('svg');
			widgetTooltip.setAttribute("id","tooltip");
			widgetTooltip.setAttribute("display","none");
			widgetTooltip.setAttribute("style","position:absolute; display:none;");
	
			//define container
			const widgetContainer = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			const text = `
			<p>
			${findable}<br>
			${accessible}<br>
			${interoperable}<br>
			${reusable}<br>
			</p>`
			widgetContainer.setAttribute("width",width);
			//overflow visible for tool
			widgetContainer.style.overflow ="hidden"
			widgetContainer.addEventListener('mousemove', e => showTooltip(e, text));
			
			
			widgetContainer.addEventListener('mouseout', e => hideTooltip());
			//Varis from browser to browser !!!!! chrome works best with 0 0 50 50
			widgetContainer.setAttribute("viewBox", "0 18 50 13");
			widgetContainer.style.backgroundColor="white"

			
			
			widgetContainer.innerHTML=`
			
			<defs>
				<LinearGradient id="F" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="${metricsData[0]*64+19}%" stop-color="${fcolor}" />
					<stop offset="${metricsData[0]*64+19}%" stop-color="${nullcolor}" />
				</LinearGradient>
			</defs>
			<defs>
				<LinearGradient id="A" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="${metricsData[1]*64+19}%" stop-color="${acolor}" />
					<stop offset="${metricsData[1]*64+19}%" stop-color="${nullcolor}" />
				</LinearGradient>
			</defs>
			<defs>
				<LinearGradient id="I" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="${metricsData[2]*64+19}%" stop-color="${icolor}" />
					<stop offset="${metricsData[2]*64+19}%" stop-color="${nullcolor}" />
				</LinearGradient>
			</defs>
			<defs>
				<LinearGradient id="R" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="${metricsData[3]*64+19}%" stop-color="${rcolor}" />
					<stop offset="${metricsData[3]*64+19}%" stop-color="${nullcolor}" />
				</LinearGradient>
			</defs>
			
			<text font-family="Arial" y="30">
				<title></title>
				<tspan id="f" fill="url(#F)">F</tspan>  
				<tspan id="a" fill="url(#A)">A</tspan>
				<tspan id="i" fill="url(#I)">I</tspan>
				<tspan id="r" fill="url(#R)">R</tspan>
			</text>
            <style>
        
            *{
                font-family:"Arial"
            }
            #tooltip {
                color: black;
                background: white;
                padding: 5px;
                opacity:0.9;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                
            }
			</style>
			`

			
			function showTooltip(evt, text) {
				
				switch (evt.target.getAttribute("id")) {
					case "f":
						text = findable;
						break;
					case "a":
						text = accessible;
						break;
					case "i":
						text = interoperable;
						break;
					case "r":
						text = reusable;
						break;
					default:
						break;
				}
				const tooltip = shadow.getElementById("tooltip");
				tooltip.style.display = "block";
				tooltip.innerHTML = text;
				tooltip.style.left = evt.pageX + 10 + 'px';
				tooltip.style.top = evt.pageY + 10 + 'px';
				
			}
			  
			function hideTooltip() {
				const tooltip = shadow.getElementById("tooltip");
				tooltip.style.display = "none";
			}
			const shadow = this.attachShadow({ mode: 'open' });
			
			//append tooltip svg to shadow
			shadow.appendChild(widgetTooltip);

			//append fair metrics svg to shadow
			shadow.appendChild(widgetContainer);
			
		}
	}

	get metrics() {
		return this.getAttribute('data-fair-metrics') || '[0,0,0,0]';
	}

	get width() {
		return this.getAttribute('width') || '100%';
	}
}

customElements.define('fair-metrics', FairMetrics);