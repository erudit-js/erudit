Привет мир!\
Тут будут задачи!

@problem
    title: First problem
    level: easy
    description: |
        This is the problem description.

@problem
    title: Complete problem
    level: medium
    attributes:
        - pretty
        - applied
    generator: generators/lemon
    description: |
        This is the problem description.

        @image
            src: ../zet/ava.jpg
            maxWidth: 100px
            caption: "{{ label }}"

        {{ foo }}
    hints:
        - This is hint 1
        - |
            This is hint 2

            {{ foo }}
    solution:
        "": |
            This is the default solution.
        Alternative: |
            This is an alternative solution. Global [link](page|article|/test/link).

            {{ foo }}
    answer: |
        The answer is 42.
    note: |
        This is an additional note.

        @diagram
            flowchart LR
                bar["{{ label }}"] -->|Переходит в| foo["{{ foo }}"]

@problem
    title: Problem with hint property
    level: easy
    description: |
        This is the problem description.
    hint: |
        This is a single hint.
    solution: |
        Абракадабра!

@problem
    title: Problem with hint property
    level: easy
    description: |
        This is the problem description.
    hint: |
        This is a single hint.
    solution:
        "Пункт А": |
            А
        "Пункт Б": |
            Б

{ text-center font-alt }
*"И сказал мудрец ВСЕ БУДЕ!"*

@problems
    title: Problem Set with shared
    level: medium
    attributes:
        - applied
        - method
    shared: |
        Везде, где это возможно выполните следующее:

        1. Найдите корни уравнения
        2. Определите резус фактор
        3. Нарисуйте примерный график функции

        А может и нет!
    set:
        - description: |
              First problem description.

              $$ A^2 + B^2 = C^2 $$
          answer: |
              First answer.
        - label: Aboba
          description: |
              Second problem description.
          hints:
              - Hint for the second problem
        -   generator: generators/lemon
            description: |
                This is the problem description.

                @image
                    src: ../zet/ava.jpg
                    maxWidth: 100px
                    caption: "{{ label }}"

                {{ foo }}
            hints:
                - This is hint 1
                - |
                    This is hint 2

                    {{ foo }}
            solution:
                "": |
                    This is the default solution.
                Alternative: |
                    This is an alternative solution.

                    {{ foo }}
            answer: |
                The answer is 42.
            note: |
                This is an additional note.

                @diagram
                    flowchart LR
                        bar["{{ label }}"] -->|Переходит в| foo["{{ foo }}"]

@problem
    title: First problem
    level: hard
    attributes:
        - pretty
    description: |
        This is the problem description.