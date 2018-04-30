---
title: "Creating and Testing Reverse Polymorphic Associations in Ruby on Rails : Part 2/2"
author: "Greg Burger"
date: "2018-04-21"
path: "creating-and-testing-reverse-polymorphic-associations-in-ruby-on-rails-part-2"
tags: ["ruby-on-rails", "polymorphic-associations"]
excerpt: "Let's look at testing an API that uses reverse polymorphic associations using RSpec and Factory Bot."
slug: "180421-test_rev_poly_api"
---

This is the second part of the two-article series on testing Reverse Polymorphic Associations. In the [first part](/creating-and-testing-reverse-polymorphic-associations-in-ruby-on-rails-part-1), we setup models, controller and routes. In this part will setup factories and write the tests.

Let's create the factory for our elements. Since you can't have an element without it being (belonging to) an elemental type, we'll make the factories for each elemental type in the same file (not super-scalable, but for this example it works fine).

```ruby
FactoryBot.define do
  factory :element do

    factory :text_block_element do
      association :elemental, factory: :text_block_elemental
    end

    factory :photo_element do
      association :elemental, factory: :photo_elemental
    end

    factory :video_element do
      association :elemental, factory: :video_elemental
    end
  end

  factory :text_block_elemental do
    text { Faker::Lorem.paragraph(2, true, 4) }
  end

  factory :photo_elemental do
    photo_url { "https://fake.photo.com/p_" + Faker::Number.number(10).to_s }
    title { Faker::Lorem.words(3) }
  end

  factory :video_elemental do
    photo_url { "https://fake.video.com/v_" + Faker::Number.number(10).to_s }
    title { Faker::Lorem.words(3) }
  end
end
```

This factory can create "empty" elements (elements that do not have an "elemental"), but that would be useless. The much more useful thing it can do is to create elements AND their associated elemental in a single `create()` call.

And here's the Article factory. It can produce an "empty" article, or by using the `:article_with_elements` factory, it can produce an article with one of each type of element by calling `create()` three times, using the three different factories defined above each time.

```ruby
FactoryBot.define do
  factory :article do
    title { Faker::Lorem.sentence }
    published_on { Faker::Time.between(2.years.ago, 1.days.ago) }

    factory :article_with_elements do
      after(:create) do |article|
        create(element: :text_block_element, article: article)
        create(element: :photo_element, article: article)
        create(element: :video_element, article: article)
      end
    end
  end
end
```

Now with a single `create(:article_with_elements)` we can create a article record, 3 element records and the associated elemental records for each.

Now to the Spec. We'll use RSpec to define some test data (using the `:article_with_elements` factory we just created) and create test for the "GET /articles/:id" API end-point.

```ruby
# /spec/requests/article_elements.rb
require 'rails_helper'

RSpec.describe 'Article Elements API', type: :request do

  # Test data
  let!(:article_with_elements) { create(:article_with_elements) }

  # Test suite for GET /articles/:article_id
  describe 'GET /articles/:article_id' do

    before { get "/articles/#{article_with_elements.id}", params: {} }

    it 'should have 3 elements' do
      expect(json['elements'].size).to be(3)
    end
  end

end
```

So far so good. Let's add some data and tests for testing the creation of a new element.

First, we'll need an article with no existing elements, so add a new line under `#Test data`.

```ruby
  let!(:article) { create(:article) }
```

Then add a new "describe" block under the one that's already there. In this block we'll test four scenarios:
1. Creating an element on an empty article should add the element
2. Creating an element on an article with other elements should add the element
3. Creating an element using invalid attributes should fail
4. Creating an element with an invalid type should fail

```ruby
  # Test suite for POST /articles/:article_id/elements
  describe 'POST /articles/:article_id/elements' do

    context 'when attempting to create a text element,' do
      # Create two sets of attributes for creating a new text element, one valid and one invalid
      let(:sample_text) { 'Just some text' }
      let(:valid_text_attributes) { { element_type: 'text', elemental_attributes: { text: sample_text } }.to_json }
      let(:invalid_text_attributes) { { element_type: 'text' }.to_json }

      context 'with valid text attributes and article with no elements,' do
        before { post "/articles/#{article.id}/elements", params: valid_text_attributes }

        it 'returns status code 201' do
          expect(response).to have_http_status(201)
        end

        it 'article contains the new (first) element' do
          get "/articles/#{article.id}", params: {}
          expect(json['elements'].size).to eq(1)
          expect(json['elements'][0]['elemental']['text']).to eq(sample_text)
        end
      end

      context 'with valid text attributes and article with existing elements,' do
        before { post "/articles/#{article_with_elements.id}/elements", params: valid_text_attributes }

        it 'returns status code 201' do
          expect(response).to have_http_status(201)
        end

        it 'article contains the new (fourth) element,' do
          get "/articles/#{article_with_elements.id}", params: {}
          expect(json['elements'].size).to eq(4)
          expect(json['elements'][3]['elemental']['text']).to eq(sample_text)
        end
      end

      context 'when request attributes are invalid for text elements,' do
        before { post "/articles/#{article.id}/elements", params: invalid_text_attributes }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end
      end
    end

    context 'when an invalid element_type in the request,' do
      before { post "/articles/#{article.id}/elements", params: { element_type: 'foobar' }.to_json }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end
    end
  end
```

Next, we'll add another "describe" block for testing updating existing elements. This block should be added under the previous one.

We'll test two things:
1. Updating an existing element with valid attributes succeeds
2. Attempting to update an non-existant element fails

```ruby
  # Test suite for PUT /articles/:article_id/elements/:id
  describe 'PUT /articles/:article_id/elements/:id' do

    context 'when attempting to update a text element,' do
      let(:new_text) { 'Some new text' }
      let(:valid_text_attributes) { { elemental_attributes: { text: new_text } }.to_json }
      let(:article_id) { article_with_elements.id }
      let(:element_id) { article_with_elements.elements[0].id }
      let(:elemental_id) { article_with_elements.elements[0].elemental_id }

      before { put "/articles/#{article_id}/elements/#{element_id}", params: valid_text_attributes }

      context 'when item exists,' do

        it 'returns status code 202' do
          expect(response).to have_http_status(202)
        end

        it 'updated the element' do
          # Reload the article to check that the element has changed in the database
          get "/articles/#{article_id}", params: {}, headers: headers
          updated_element = json['elements'].select { |element| element['elemental']['id'] == elemental_id }
          expect(updated_element.size).to eq(1)
          expect(updated_element[0]['elemental']['text']).to eq(new_text)
        end
      end

      context 'when the item does not exist,' do
        let(:article_id) { 9999 }

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end

    end
  end
```

So, as you can see, creating an API that uses reverse polymorphic associations and testing it isn't all that difficult. Knowing how to build factories and then writing tests using them makes testing fairly straight forward.

>In an actual API, we'd want to test all the end-points of course, but I just want this article to focus on the end-points that are "complicated" due to the slightly more complex associations we're looking at.
