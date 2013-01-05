Feature: DateTime field tests
    Functional tests for the editlive DateTime field

    Scenario: Datetime Initial state
        Given I open the datetime test page
        Then I see "input#id_datetime_test[name='datetime_test'][type='text']"
        Then I see a "datetimeField" editlive for "#id_datetime_test"
        Then I see "#id_datetime_test" is hidden
        Then I see a visible placeholder for "#id_datetime_test"

    Scenario: Datetime Edit mode
        Given I open the datetime test page
        When I click on the placeholder for "#id_datetime_test"
        Then I see "#id_datetime_test" is visible


