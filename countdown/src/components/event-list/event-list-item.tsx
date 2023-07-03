import React from 'react';
import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
} from '@ionic/react';
import { CountdownEvent } from '../../core/countdownEvent';
import './style.css';

export type CELIProps = {
	event: CountdownEvent;
	finish: number;
};

export type CELIState = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	shadow: string;
};

export default class CEventListItem extends React.Component<
	CELIProps,
	CELIState
> {
	counter!: NodeJS.Timer;

	constructor(props: CELIProps) {
		super(props);
		this.state = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			shadow: `0px -4px 3px -3px rgb(200, 50, 0), 0px 4px 3px -3px rgb(255, 0, 0)`,
		};
	}

	setCountdownState() {
		let seconds = Math.floor((this.props.finish - Date.now()) / 1000);
		const sp = Math.floor(seconds / 10000);
		const s = [
			{
				r: -50 + sp > 0 ? -50 + sp : 0,
				g: 305 - sp < 255 ? 305 - sp : 255,
			},
			{ r: 0 + sp, g: 255 - sp },
		];
		this.setState({
			shadow: `0px -3px 3px -3px rgb(${s[0].r}, ${s[0].g}, 0), 0px 3px 3px -3px rgb(${s[1].r}, ${s[1].g}, 0)`,
		});
		this.setState({ days: Math.floor(seconds / 86400) || 0 });
		seconds = seconds % 86400;
		this.setState({ hours: Math.floor(seconds / 3600) || 0 });
		seconds = seconds % 3600;
		this.setState({ minutes: Math.floor(seconds / 60) || 0 });
		seconds = seconds % 60;
		this.setState({ seconds: seconds || 0 });
		seconds = 0;
	}

	format(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}

	async componentDidMount(): Promise<void> {
		this.setCountdownState();
		setInterval(() => this.setCountdownState(), 1000);
	}

	render() {
		return (
			<IonCard
				className="countdown-event"
				style={{ boxShadow: this.state.shadow }}
			>
				<IonCardHeader>
					<IonCardSubtitle>
						{this.props.event
							.finishDate()
							.replace(/\.[0-9]{3}Z/, '')
							.split('T')
							.reverse()
							.join(' ')}
					</IonCardSubtitle>
					<IonCardTitle style={{}}>
						<h2 className="countdown-event-title">
							{this.props.event.name()}
						</h2>
					</IonCardTitle>
				</IonCardHeader>
				{this.props.finish - Date.now() > 0 && (
					<IonCardContent className="countdown-event-remaining">
						<p>
							<span>d</span>
							<strong>{this.format(this.state.days)}</strong>
						</p>
						<p>
							<span>h</span>
							<strong>{this.format(this.state.hours)}</strong>
						</p>
						<p>
							<span>m</span>
							<strong>{this.format(this.state.minutes)}</strong>
						</p>
						<p>
							<span>s</span>
							<strong>{this.format(this.state.seconds)}</strong>
						</p>
					</IonCardContent>
				)}
			</IonCard>
		);
	}
}
