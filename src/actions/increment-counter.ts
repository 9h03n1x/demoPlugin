import { action, DialDownEvent, DialRotateEvent, DidReceiveSettingsEvent, JsonValue, KeyDownEvent, SendToPluginEvent, SingletonAction, TouchTapEvent, WillAppearEvent } from "@elgato/streamdeck";
import streamDeck, { LogLevel } from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("increment");
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
		let count= ev.payload.settings.count ?? 0;
		let increment= ev.payload.settings.increment?? 1;
		count = parseInt(count.toString()) + parseInt(increment.toString());
		logger.info(`newCount: ${count}`);
		
		// Update the current count in the action's settings, and change the title.
		await ev.action.setSettings({ count, increment });
		await ev.action.setTitle(`${count}`);
	}

	async onDialDown(ev: DialDownEvent<CounterSettings>): Promise<void>{
		let count = 0;
		let increment = ev.payload.settings.increment ?? 1;
		await ev.action.setSettings({ count, increment });
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
		let increment = ev.payload.settings.increment ?? 1;
		count = count + (ev.payload.ticks*increment);
		await ev.action.setSettings({ count, increment });
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
		logger.info("onTouchTap");
		let count = 100;
		let increment = ev.payload.settings.increment ?? 1;
		await ev.action.setSettings({ count, increment });
		await ev.action.setFeedback(
			{
			"title":`Touchscreen tapped`,
			"value": count,
			"icon": "imgs/plugin/category_icon"
			}
		  );
	}
	async onSendToPlugin(ev: SendToPluginEvent<JsonValue, CounterSettings>): Promise<void> {
		let increment = ev.payload!["increment" as keyof object] ?? 1;
		logger.info(`increment: ${increment} received from property inspector`)
		const count = (await ev.action.getSettings()).count;
		ev.action.setSettings({count, increment})
	}

	onDidReceiveSettings(ev: DidReceiveSettingsEvent<CounterSettings>): Promise<void> | void {
		let increment: number  = ev.payload.settings.increment ?? 1;
		let count : number = ev.payload.settings.count ?? 0;

		ev.action.setSettings( { count, increment});
	}
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
	count: number;
	increment : number;
};

