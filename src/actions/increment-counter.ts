import { action, DialDownEvent, DialRotateEvent, KeyDownEvent, SingletonAction, TouchTapEvent, WillAppearEvent } from "@elgato/streamdeck";

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.niccohagedorn.demoplugin.increment" })
export class IncrementCounter extends SingletonAction<CounterSettings> {
	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it become visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link IncrementCounter.onKeyDown}.
	 */
	onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
		if (ev.payload.controller == "Keypad"){
			ev.action.setImage("imgs/plugin/marketplace");
			return ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
		}else{
			ev.action.setFeedbackLayout("$A1")
			
			return ev.action.setFeedback(
				{
				"value": 100,
				"icon": "imgs/actions/counter/key"
				}
			  );
		}
		
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		// Determine the current count from the settings.
		let count = ev.payload.settings.count ?? 0;
		count++;
		
		// Update the current count in the action's settings, and change the title.
		await ev.action.setSettings({ count });
		await ev.action.setTitle(`${count}`);
	}

	async onDialDown(ev: DialDownEvent<CounterSettings>): Promise<void>{
		let count = 0;
		await ev.action.setSettings({ count });
		return ev.action.setFeedback(
			{
			"title": "Dial pressed",
			"value": count,
			"icon": "imgs/actions/counter/key"
			}
		  );

	}

	async onDialRotate(ev: DialRotateEvent<CounterSettings>): Promise<void>{
		let count = ev.payload.settings.count ?? 0;
		count = count + ev.payload.ticks;
		await ev.action.setSettings({ count });
		await ev.action.setFeedback(
			{
			"title":`Dial rotating ${ev.payload.ticks}`,
			"value": count,
			"icon": "imgs/plugin/marketplace"
			}
		  );
	}

	async onTouchTap(ev: TouchTapEvent<CounterSettings>): Promise<void>
	{
		let count = 100;
		await ev.action.setSettings({ count });
		await ev.action.setFeedback(
			{
			"title":`Touchscreen tapped`,
			"value": count,
			"icon": "imgs/plugin/category_icon"
			}
		  );
	}
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
	count: number;
};
