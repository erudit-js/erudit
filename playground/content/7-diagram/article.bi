Привет, мир!

$$ A^2 + B^2 = C^2 $$

@diagram
    caption:
        main: This is my diagram
        secondary: It is very good!
    content: |
        graph TD
            root[Базовый подсчет комбинаций]:::featured -->|Разбить на группы и сложить| sumRule[Правило суммы]
            root -->|"Последовательно выбирать элементы"| productRule[Правило произведения]

Это мой параграф.

@important
    main: |
        @diagram
            content: |
                graph TD
                    root#$@[Базовый подсчет комбинаций]:::featured -->|Разбить на группы и сложить| sumRule[**Правило суммы**]
                    root -->|"Последовательно выбирать элементы"| productRule[**Правило произведения**]
                    class sumRule,productRule fill

@term
    main: |
        @diagram
            content: |
                graph TD
                    root[Базовый подсчет комбинаций]:::featured -->|Разбить на группы и сложить| sumRule[Правило суммы]
                    root -->|"Последовательно выбирать элементы"| productRule[Правило произведения]
                    class sumRule,proudctRule fill

@statement
    main: |
        @diagram
            content: |
                graph TD
                    root[Базовый подсчет комбинаций]:::featured -->|Разбить на группы и сложить| sumRule[Правило суммы]
                    root -->|"Последовательно выбирать элементы"| productRule[Правило произведения]
                    class sumRule,proudctRule fill

@diagram
    flowchart TD
        root[**Комбинаторная конфигурация**]:::featured --> question{{"`Порядок элементов важен\?`"}}

        question -->|Да| arrangement[**Размещение**]:::featured
        question -->|Нет| combination[**Сочетание**]:::featured

        arrangement -->|Без повторений| awr["$$ \set{sdf} A_n^k = \frac{\sqrt{D}n!}{(n-k)!} $$"]
        arrangement -->|С повторениями| ar["$$ \bar{A}_n^k = n^k $$"]

        combination -->|Без повторений| cwr["$$ C_n^k = \frac{\sqrt{D}n!}{(n-k)! \ k!} $$"]
        combination -->|С повторениями| cr["$$ \bar{C}_n^k = C_{n+k-1}^k $$"]

        awr -->|Используются все элементы| permutation[**Перестановка**]:::featured

        permutation -->|Без повторений| pwr["$$ P_n = n! $$"]
        permutation -.->|С повторениями$^*$| pr["$$ P_{n_1, \ \ldots, \ n_k} = \frac{n!}{n_1! \ \ldots \ n_k!} $$"]

        class root,arrangement,combination,permutation,cwr fill