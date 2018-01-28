---
title: "Dynamically Adding CSS Style Sheets and Classes in React"
author: "Greg Burger"
date: "2018-01-28"
path: "dynamically-adding-css-in-react"
tags: ["javascript", "react", "css", "css-animation"]
excerpt: "Creating dynamic CSS classes and animation keyframes in React can be a bit tricky. Let's look at how to do it."
slug: "180128-dynamic_css_react"
---

One thing React lacks is a predefined way, or set of methods, for managing your app's CSS. To fill that gap, quite a few plug-ins have been developed, all using different strategies to help manage CSS style sheets and classes.

Regardless of which one, if any, your app may use, sometimes you just need to create a new class, modify an existing one, or even create some keyframes for a CSS animation - all based on something happening in your app at the time (ie: maybe based on data coming from a database, or a user's interaction with the UI).

So, this is how you do it, not relying on any CSS plugin, just using pure React and Javascript.

Here's a working example of the final version of the code:
[https://github.com/GregX999/react-dynamic-styles-example](https://github.com/GregX999/react-dynamic-styles-example)

First, the basics. Let's create a method to create new &lt;style&gt; tag in the DOM. The method will require an id (string) so we can find the new &lt;style&gt; tag when we want to add styles to it, or remove it.

```javascript
const createStyleTag = (id) => {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('id', id);
  document.head.appendChild(styleElement);
}
```

_Note, the above code will directly modify the actual DOM. It doesn't use, nor is it even aware of, React's virtual DOM._

Ok, now let's add a method to add styles to our new &lt;style&gt; tag. This method requires the id of the &lt;style&gt; tag (the same one used with the createStyleTag() method), and the new style, as a string.

```javascript
const insertStyle = (id, style) => {
  const styleElement = document.getElementById(id);
  const sheet = styleElement.sheet;
  sheet.insertRule(style, sheet.rules.length);
}
```

Here's an example of using the two methods we have so far in a React component.

```javascript
const CrazyText = ({textColor, degsToRotate, children}) => {
	createStyleTag('myStyles');

	const newKeyframes = `@keyframes rotateDegs {
		0% { transform: rotate(0deg); transform-origin: center; }
		100% { transform: rotate(${degsToRotate}deg) }
	}`;
	insertStyle('myStyles', newKeyframes);

	const newClass = `.crazyText {
		color: ${textColor};
		display: inline-block;
		font-size: 2em;
		animation-name: rotateDegs;
		animation-duration: 1s;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}`;
	insertStyle('myStyles', newClass);

	return <div className='crazyText'>{children}</div>
}
```

And to use our new component:

```javascript
const someOuterComponent = () => {
	return (
		<div>
			...
			<CrazyText textColor='red' degsToRotate='-30'>This text is CRAZY!</CrazyText>
			...
		</div>
	}
}
```

Did you see that?!? We used passed-in props in our styles (textColor and degsToRotate in this case). So dynamic!

There are two potential gotchas with what we've done so far though.

The first is what happens when we add more than one CrazyText to the page at the same time. Every time the component is used, we're creating a new &lt;style&gt; tag, and giving it the same id as all the others we've used. Not only that, but in each &lt;style&gt; tag, we're creating a new class with the same name as all the other classes we've added. No bueno.

The second is what happens after we've added, then removed, many CrazyText components over the course of a user's interaction with the site. We're adding a new &lt;style&gt; tag for each new component, but never removing them when the component is unmounted. It probably won't affect anything unless you're adding thousands of &lt;style&gt; tags, but it's still sloppy.

*(I have no idea how many &lt;style&gt; tags the DOM can contain before a browser starts to act strange. Maybe millions. But I'm just the kind of guy that'd rather not leave unused &lt;style&gt; tags hanging around.)*

How to solve these issues? Well, the easiest way (IMHO) is to generate a unique &lt;style&gt; tag id and class name each time the component is used, and then remove the &lt;style&gt; tag when the component unmounts.

First, we need to create a new method to remove a &lt;style&gt; tag.

```javascript
const removeStyleTag = (id) => {
	const styleElement = document.getElementById(id);
  if (styleElement) {
    document.head.removeChild(styleElement);
  }
}
```

Then, our new CrazyText component (now converted to a class):

```javascript
class CrazyText extends React.Component {
	constructor(props) {
		super(props);

		this.componentId = Math.round(Math.random() * 100000);
		this.styleElementId = 'crazyText_' + this.componentId;
		createStyleTag(this.styleElementId);

		const newKeyframesName = 'rotateDegs_' + this.componentId;
		const newKeyframes = `@keyframes ${newKeyframesName} {
			0% { transform: rotate(0.0turn); transform-origin: center; }
			100% { transform: rotate(${props.degsToRotate}deg) }
		}`;
		insertStyle(this.styleElementId, newKeyframes);

		this.myClassName = 'crazyText_' + this.componentId;
		const newClass = `.${this.myClassName} {
			color: ${props.textColor};
			display: inline-block;
			font-size: 2em;
			animation-name: ${newKeyframesName};
			animation-duration: 1s;
			animation-iteration-count: 1;
			animation-fill-mode: forwards;
		}`;
		insertStyle(this.styleElementId, newClass);
	}

	componentWillUnmount() {
		removeStyleTag(this.styleElementId);
	}

	render() {
		return <div className={this.myClassName}>{this.props.children}</div>
	}
}
```

As you can see, we've created a unique id for each instance of the component, and we're using it when we both create the &lt;style&gt; tag, and when we remove it in the componentWillUnmount() method.

We're also generating a unique name for the new css class and keyframes (using the same unique id we used for the &lt;style&gt; tag id). This way each instance of CrazyText will have it's own class rather than all of them trying to use the last class defined.

_Note: Yes, I know, `Math.random() * 100000` is not guaranteed to be unique. If you must, use a hash or MD5 or some UUID generator, whatever makes you feel good. I'm fine with a thousandth of a percent chance of a clash for something like this._

With this solution, there will always be one &lt;style&gt; tag in the DOM for every CrazyText component on the screen, and never any extra hanging around after the component unmounts. Good stuff!
