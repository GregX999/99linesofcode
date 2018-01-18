---
title: "Polymorphic Associations in Ruby on Rails : Part 1 - Introduction"
author: "Greg Burger"
date: "2017-11-27"
path: "polymorphic-associations-in-ruby-on-rails-part-1-introduction"
tags: ["ruby-on-rails", "polymorphic-associations"]
excerpt: "What are polymorphic associations and how do you make them using ActiveModel in Ruby on Rails."
slug: "171127-poly_assoc_p1"
---

This is the first part in a three-part series of articles about Polymorphic Associations in Ruby on Rails, using Active Model, database migrations, RSpec and Factory Bot (formerly Factory Girl). This first part will introduce the concept and show how to construct the most basic polymorphic association.

The four parts are:

1. **Introduction and how to create a basic Polymorphic Association**
2. [Reverse Polymorphic Associations](https://99linesofcode.com/polymorphic-associations-in-ruby-on-rails-part-2-reverse-polymorphic-associations)
3. [Many-to-Many Polymorphic Associations](https://99linesofcode.com/polymorphic-associations-in-ruby-on-rails-part-3-many-to-many-polymorphic-associations)
4. _Coming Soon!_ - Testing Polymorphic Associations with RSpec and Factory Bot

First thing's first... before talking about polymorphic associations, it's important that you to have a fairly strong grasp of the <em>standard</em> association types in Rails. These being:

* has\_one
* has_many
* belongs\_to
* has_one :through
* has_many :through
* has\_and\_belongs\_to\_many

If you don't understand how these work, or don't know how to implement them, read-up on them in the <a href="http://guides.rubyonrails.org/association_basics.html#the-types-of-associations">Active Record documentation : The Types of Associations</a>.

###What is a Polymorphic Association?

So, it should be clear that a "normal" (non-polymorphic) association is an association between records of two different models. For example, a Post record and Comment records (a Post record has_many Comment records), or a User record and an Address record (a User record has_one Address record). And the inverse, a Comment record belongs_to a Post record, and an Address record belongs to a User record.

![A comment belongs to a post.](https://99linesofcode.com/wp-content/uploads/2018/01/standard-assoc.png)

Simple, right?

In a polymorphic association, a record of one type can belong to record of one of multiple other types. For example, let's say we have a news blog. Of course each Post record can have many Comment records, but maybe also Photo and Page records can have many Comment records. So each Comment record is able to belong to either a Post, Photo or Page record.

![A comment can belong to any type of "commentable item".](https://99linesofcode.com/wp-content/uploads/2018/01/poly-assoc.png)

How do we do this? Let's dive right in and create some models. I'll explain what's going on after we get them created.

First, we'll create the three parent models. (I use the term "parent" to mean a model than "has" another model. And "child" to mean a model that "belongs to" another model.)

```bash
rails g model Post title:string body:text
rails g model Photo caption:string url:string
rails g model Page title:string body:text
```

Then we'll create the child model, the model that will reference the parent(s).

```bash
rails g model Comment comment:string references:commentable{polymorphic}
```

Let's add the has_many associations to the three "parent" models:

```ruby
class Post < ApplicationRecord
  has_many :comments, as: :commentable
end

class Photo < ApplicationRecord
  has_many :comments, as: :commentable
end

class Page < ApplicationRecord
  has_many :comments, as: :commentable
end
```

The generator will have added the belongs_to association to the Comment model.

```ruby
class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
end
```

Ok, a few things to talk about here...

First, what the heck is "commentable"? Where did that come from? Well, what this is saying is that a Comment record can belong to any record of any model that is "commentable". Using "as: :commentable" in the has\_many associations of the Post, Photo and Page models makes them "commentable" (items that can be commented on). You can think of "commentable" as being the name of the association.

> ###A note on naming polymorphic associations
>
> There is no right or wrong way to name a polymorphic association. I chose the name "commentable" because it makes sense. Posts, photos and pages are all "commentable" objects - they can be commented on. It's common to give these associations names that end with "-able" or "-ible" (ie: imagable, tagable, edible, damageable) but it's not required.

As you know, a model with a belongs\_to association has a foreign key pointing to the id of whichever record it belongs to. But, how does our Comment record know which model it's parent belongs to? If the foreign key is "12", does that mean the record with the id of 12 in the posts table, the photos table, or the pages table?

Well, if you peek into the database and look at the comments table, you'll see is something like this:

```
id               : int
comment          : varchar(255)
commentable_id   : int
commentable_type : varchar(255)
```

Each record points not only to an "id", but also to a "type", which is the name of the model. So if commentable\_id is "12" and commentable\_type is "Post", we know to look in the posts table for the record with an id of 12. Easy-peasy!

So that covers associations where a child's parent can potentially be any item of any model. The reverse of that, where items of a parent model can have a single association containing children of a mix of multiple models, is called a "reverse polymorphic association".
