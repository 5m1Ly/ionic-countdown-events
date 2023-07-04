import React from 'react';
import { CountdownEventStore } from '../../core/countdownEventStore';
import CEventListItem from './event-list-item';
import './style.css';

export type CELProps = {
	events: CountdownEventStore;
	active: boolean;
};

export type CELState = {
	events: JSX.Element[];
};

export default class CEventList extends React.Component<CELProps, CELState> {
	constructor(props: CELProps) {
		super(props);
		this.state = {
			events: [],
		};
	}

	async componentDidMount() {
		const store = this.props.events;
		const listItems: JSX.Element[] = [];
		const events = await store.events(this.props.active);

		if (events === null) return;
		for (const event of events) {
			listItems.push(
				<CEventListItem
					key={event.uuid()}
					event={event}
					finish={Date.parse(event.finishDate())}
				/>
			);
		}
		this.setState({
			events: listItems.sort((a, b) =>
				a.props.finish > b.props.finish ? 1 : 0
			),
		});
	}

	render() {
		return (
			<div>
				<div>{this.state.events}</div>
			</div>
		);
	}
}
