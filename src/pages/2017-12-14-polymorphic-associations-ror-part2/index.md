---
title: "Polymorphic Associations in Ruby on Rails : Part 2 - Reverse Polymorphic Associations"
author: "Greg Burger"
date: "2017-12-14"
path: "polymorphic-associations-in-ruby-on-rails-part-2-reverse-polymorphic-associations"
tags: ["ruby-on-rails", "polymorphic-associations"]
excerpt: "In the 2nd part of this series, we'll dive into reverse polymorphic associations and how to create them using ActiveModel in Ruby on Rails."
slug: "171214-poly_assoc_p2"
---

This is the second part in a four-part series of articles about polymorphic associations in Ruby on Rails, using Active Model, database migrations, RSpec and Factory Bot (formerly Factory Girl). This part will explain reverse polymorphic associations - what they are and how to make them.

The four parts are:

1. [Introduction and how to create a basic Polymorphic Association](https://99linesofcode.com/polymorphic-associations-in-ruby-on-rails-part-1-introduction)
2. **Reverse Polymorphic Associations**
3. [Many-to-Many Polymorphic Associations](https://99linesofcode.com/polymorphic-associations-in-ruby-on-rails-part-3-many-to-many-polymorphic-associations)
4. _Coming Soon!_ - Testing Polymorphic Associations with RSpec and Factory Bot

In the previous article we looked at the "standard" polymorphic association in Rails, where the child items (the comments) in the association can belong to different types of parent items (posts, photos and pages). This works nicely because with any has_one or has_many association the child model holds the foreign key, and a polymorphic association just adds a "foreign type" as well (in the last article's example, commentable\_id and commentable\_type).

In a reverse polymorphic association, it's the parent items that can have many children of more than one type. This is a bit more complicated since there's no obvious place for the "xxxx\_type" field to go - it has to go where the "xxxx\_id" field is, but it's not the child that needs it, it's actually every association that needs to know the type of child being associated. So what we really need is another table, a table that represents the association itself. Something else to note, the "association table" will use a regular polymorphic association.

>###Just to be clear...
>In Rails, the term "reverse polymorphic association" refers to a method of setting up a polymorphic association using multiple models, there's no actual "reverse\_polymorphic" keyword to use.

Let's say we want the articles in our news blog to be made up of multiple media types - text blocks, photos and videos. Each article will be a collection of these media types organized in a specific sequence. We'll call these "article elements".

Here's a diagram of what we want to do:

![Different "article elements" can all belong to posts.](https://99linesofcode.com/wp-content/uploads/2018/01/reverse-poly.png)

Here's a diagram of what models (and database fields) we have to make:

![Example of reverse polymorphic models.](https://99linesofcode.com/wp-content/uploads/2018/01/reverse-poly-models.png)

Let's generate the models (I'm including the models from the previous article in case you came straight to this article. But of course you wouldn't generate the same model twice in real life.)

```bash
rails g model Article title:string published_on:date
rails g model TextBlock body:string
rails g model Photo caption:string filename:string
rails g model Video title:string filename:string
```

And, the association model.

```bash
rails g model ArticleElement sequence:int references:article references:element{polymorphic}
```

Let's look at the models. First, the Post model:

```ruby
class Post < ApplicationRecord
  has_many :article_elements, dependent: :destroy
end
```

Then the media types that a post is made up of:

```ruby
class TextBlock < ApplicationRecord
  has_one :article_element, as: :element, dependent: :destroy
  has_one :article, through: :article_element
end

class Photo < ApplicationRecord
  has_one :article_element, as: :element, dependent: :destroy
  has_one :article, through: :article_element
end

class Video < ApplicationRecord
  has_one :article_element, as: :element, dependent: :destroy
  has_one :article, through: :article_element
end
```

And finally, the association table (can also be called a "join table" since it joins the other models together). I've named it "ArticleElement" as it joins articles to elements.

```ruby
class ArticleElement
  belongs_to :article
  belongs_to :element, polymorphic: true
  default_scope { order(:sequence).includes(:element) }
end
```

Ok, what's going on here? Well, the Article model has a single has\_many association, "article\_elements". We also have models for each media type that can be an element (TextBlock, Photo and Video). All of them have a has_one association to "article\_element" as "element".

The ArticleElement model is the model that represents the association between articles and elements (the three media types). Records of its type both belong to n article and belong to an "element" - and that's where the "polymorphic: true" comes into play - ArticleElement records will have both element_id and element\_type fields.

If you remember from the last article, polymorphic associations have names ("commentable" from the previous article). In this case, I've just named the association "element", as that's what each media type record is, an element of an article.

The three item types all declare:

```ruby
  has_one :article, through: :article_element
```

Which allows us to quickly find the article an element belongs to:

```ruby
photo = Photo.find(:photo_id)
puts photo.article
```

Also note the "dependent: destroy" declarations on some of the associations. Since we are using an association table, we want to make sure that records in that table are destroyed when an article or an element is destroyed. Also, if we destroy an article, which triggers all the article_elements to be destroyed, that should destroy the elements as well. If we don't do this, we'll have orphan records cluttering up the database.

Lastly, note there is a default scope on the ArticleElement model. This ensures that an article's elements are retrieved in the correct sequence, and also, chances are if we are retrieving a record of this model type, we're really looking for the element record it's associated with (the actual text block, photo or video).

There's something to watch out for when using reverse polymorphic association. You're going to always have to deal with that association table when retrieving or creating child items. As well as taking into account differences in the various children models. Here's what I mean:

```ruby
article = Article.find(:article_id)
elements = article.article_elements

# First, check the element_type
if elements[0].element_type == 'Photo'
  # To get the photo's caption, we have to do this:
  elements[0].element.caption

  # This won't work
  elements[0].caption
end

# To add a new element, we have to create the ArticleElement
# record that links a article to the element:
article = Article.find(:article_id)
photo = Photo.create({ caption:"Alien Abduction Infographic", filename:"aa_info.jpg" })
Article.article_elements.create({ element: photo })
```
