---
title: "Creating and Testing Reverse Polymorphic Associations in Ruby on Rails : Part 1/2"
author: "Greg Burger"
date: "2018-03-12"
path: "creating-and-testing-reverse-polymorphic-associations-in-ruby-on-rails-part-1"
tags: ["ruby-on-rails", "polymorphic-associations"]
excerpt: "Let's setup an API that uses reverse polymorphic associations so we can then test it with RSpec and Factory Bot."
slug: "180312-create_rev_poly_api"
---

I previously wrote [a series on setting up polymorphic associations in Ruby on Rails using Active Model](/polymorphic-associations-in-ruby-on-rails-part-1-introduction). One of the articles was focused on [Reverse Polymorphic Associations](/polymorphic-associations-in-ruby-on-rails-part-2-reverse-polymorphic-associations). In this next series of two article, I want to show how to write request specs for those associations using RSpec and Factory Bot (formerly Factory Girl). This article will assume we're creating an API, and we want to create, and test, API endpoints.

Here are the models we setup in that previous article on Reverse Polymorphic Associations. I've also added some validation just to help illustrate some tests in the next article.

```ruby
class Article < ApplicationRecord
  has_many :elements, dependent: :destroy

  validates :title, presence: true
end

# The three types of article elements

class TextBlock < ApplicationRecord
  has_one :element, as: :elemental, dependent: :destroy
  has_one :article, through: :element

  validates :text, presence: true
end

class Photo < ApplicationRecord
  has_one :element, as: :elemental, dependent: :destroy
  has_one :article, through: :element

  validates :title, presence: true
  validates :photo_url, presence: true
end

class Video < ApplicationRecord
  has_one :element, as: :elemental, dependent: :destroy
  has_one :article, through: :element

  validates :title, presence: true
  validates :video_url, presence: true
end

# The "join table"

class Element
  belongs_to :article
  belongs_to :elemental, dependent: :destroy, polymorphic: true
  default_scope { order(:sequence).includes(:elemental) }
end
```

Since we're going to write request specs, we need to define some routes and figure out what controller methods we need to support them. Assuming we can CRUD Articles, let's assume that we want to only CRUD Elements in relation to the Article they belong to. Let's also take advantage of the fact that we don't *need* to map models, controllers and routes in a 1-to-1 ratio, and instead let's create an abstraction by having a single Elements controller that can handle all the different element types as well as manage the join table.

Here are our routes (just the relevant ones):

```ruby
Rails.application.routes.draw do
  ...
  resources :articles do
    resources :elements, only: [:create, :update, :destroy]
  end
  ...
end
```

We're using nested routes so that it's clear we're only going to be able to CRUD an element in relation to it's parent article. This will help prevent creation of elements that don't belong to an article, or attempting to CRUD an element without knowing which article it belongs to.

Here's our Elements controller:

```ruby
class ElementsController < ApplicationController

  before_action :set_article
  before_action :set_element, only: [:update, :destroy]

  def create
    element = @article.elements.create!(element_params)
    render json: element, status: :created
  end

  def update
    @element.update!(element_params)
    @element.reload
    render json: @element, status: :accepted
  end

  def destroy
    @element.destroy
    head :no_content
  end

  private

  def element_params
    # If there is no element (because we're creating a new one) and the element_type is
    # passed in (which is required when creating a new element), then set the elemental_type
    # and make sure elemental_id is nil.
    if !@element && params[:element_type]
      params[:elemental_type] = params[:element_type].camelize + 'Element'
      params[:elemental_id] = nil

    # If there is an @element (because we're updating), then set the params elemental_typa so
    # the case statement below returns the correct permitted params.
    elsif @element
      params[:elemental_type] = @element.elemental_type

    # Otherwise, return an empty hash right away because trying to create a new element
    # without passing in an element_type is a no-no.
    else
      return {}
    end

    # If a sequence was passed-in, use that, otherwise figure out the
    # next sequence by adding 1 to highest sequence in articles's elements
    if !params[:sequence] || params[:sequence] == ''
      params[:sequence] = @article.elements.size > 0 ? @article.elements.last.sequence + 1 : 0
    end

    # Which params are permitted depends on the elemental_type
    case params[:elemental_type]
    when 'TextElement'
      params.permit(:sequence, :elemental_type, :elemental_id, elemental_attributes: [ :text ])
    when 'PhotoElement'
      params.permit(:sequence, :elemental_type,:elemental_id, elemental_attributes: [ :title, :photo_url ])
    when 'VideoElement'
      params.permit(:sequence, :elemental_type,:elemental_id, elemental_attributes: [ :title, :video_url ])
    end
  end

  def set_article
    @article = Article.find(params[:article_id])
  end

  def set_element
    @element = @article.elements.find(params[:id])
  end

end
```

This is certainly a bit more complicated that a "normal" CRUD controller, but not too bad (IMO).

The main thing that's different about this controller compared to one that represents a single resource is the "element_params" method. Normally, it would define the params that are allowed to be inserted/updated during a "create" or "update". Like this example:

```ruby
def article_params
  params.permit(:title, :text, :date, :published)
end
```

But since the Elements controller is also handling the element (text, photos, videos) we need some logic to determine which `params.permit()` to call.

On to [Part 2 - Creating the Factories and Tests](/creating-and-testing-reverse-polymorphic-associations-in-ruby-on-rails-part-2)
