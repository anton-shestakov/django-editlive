Feature: Char field
    Functional tests for the editlive Char field

    Scenario: Initial state
        Given I access the url "/editlive/test/char/"
        Then I see "input#id_char_test[name='char_test'][type='text'][maxlength='250']"
        Then the value of "#id_char_test" is "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        Then I see a "charField" editlive for "#id_char_test"
        Then I see "#id_char_test" is hidden
        Then I see a visible placeholder for "#id_char_test"

    Scenario: Edit mode
        Given I access the url "/editlive/test/char/"
        When I click on the placeholder for "#id_char_test"
        Then I see "#id_char_test" is visible

    Scenario: Edit and save
        Given I access the url "/editlive/test/char/"
        When I click on the placeholder for "#id_char_test"
        Then I see "#id_char_test" is visible
        When I input "Hello World" in "#id_char_test"
        Then the value of "#id_char_test" is "Hello World"
