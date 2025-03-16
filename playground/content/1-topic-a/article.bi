Это статьяs

{ #net +toc }
$$ A^2 + B^2 = C^2 $$

# Первый заголовок

~ bar summary|combinatorics/preface|myFormula

{ #da }
Посмотрите вот на [эту](~bar) формулу!\
Еще зацените [книгу](page|book|combinatorics) по комбинаторике!

{ +toc }
@important
    title: Очень важный блок!
    main: |
        Lol

{ +toc }
@important
    title: Бином Ньютона
    main: |
        Формула, позволяющая напрямую получать результат возведения любого двучлена в любую натуральную степень:

        $$ (a+b)^n = C_n^0 a^{n-0}b^0 + C_n^1 a^{n-1}b^1 + C_n^2 a^{n-2}b^2 + \ldots + C_n^n a^{n-n}b^n $$

        В компактном виде:

        $$ (a+b)^n = \sum\limits_{k=0}^n C_n^k a^{n-k}b^k $$

        В формулах выше записи вида $C_n^k$ это количества сочетаний из $n$ по $k$.
    sections:
        "Пример построения слагаемых": |
            Левая часть равенства по определению степени является длинной цепочкой из $n$ умножающихся друг на друга скобок:

            $$ (a+b)^n = (a+b) (a+b) (a+b) \ldots $$

            Мы уже знаем, как легко работать с произведением многочленов.
            Каждая из скобок "превращается" либо в $a$, либо в $b$, тем самым образуя $n$-буквенную комбинацию.
            Потом все возможные комбинации складываются:

            $$ aaaaa\ldots + babab \ldots + bbaab\ldots + \ldots $$

            Каждая такая комбинация является слагаемым в большой сумме, поэтому далее мы так и будем их называть.

            Например, если каждая скобка превратится в $a$, то мы получим слагаемое $a^n$:

            @math
                \def\arraystretch{1.5}
                \begin{array}{}
                    (a+b) & (a+b) & (a+b) & \ldots &
                    \\ \hline
                    a & a & a & \ldots & = a^n
                \end{array}

            Если в $a$ превратить только одну скобку, а остальные $(n-1)$ скобок в $b$, то получим слагаемое вида $ab^{n-1}$.
            Причем таких слагаемых будет аж $n$ штук, потому что в $a$ можно превратить любую из $n$ скобок (первую, вторую, $n$-ую):

            @math
                \def\arraystretch{1.5}
                \begin{array}{}
                    (a+b) & (a+b) & (a+b) & \ldots &
                    \\ \hline
                    a & b & b & \ldots & = ab^{n-1}
                    \\ \hline
                    b & a & b & \ldots & = ab^{n-1}
                    \\ \hline
                    b & b & a & \ldots & = ab^{n-1}
                    \\ \hline
                    \vdots
                \end{array}

            Складываем вместе эти $n$ одинаковых слагаемых и получаем $n \cdot ab^{n-1}$.
        proof: |
            Превратим ровно $k$ скобок в $b$.
            Остальные $n-k$ скобок автоматически превращаются в $a$.
            Тогда слагаемое будет иметь вид $a^{n-k}b^k$.

            Слагаемых такого вида будет столько, сколькими способами можно выбрать $k$ скобок для превращения в $b$.
            Порядок, в котором выбраются скобки значения не имеет, поэтому каждый выбор скобок это сочетание из $n$ всех скобок по $k$ скобкам для превращения.
            Всего $C_n^k$ способов эти скобки выбрать.

            Итак, превратив $k$ скобок в $b$ мы получаем $C_n^k$ одинаковых слагаемых вида $a^{n-k}b^k$.
            Складываем их вместе и получаем общий вид слагаемого в разложении бинома Ньютона:

            $$ \boxed{C_n^k a^{n-k}b^k} $$

            Переменная $k$ по очереди принимает **все** значения от $0$ (ни одна скобка не станет $b$) до $n$ (все скобки стали $b$).
            И каждое новое значение $k$ порождает очередное слагаемое в разложении бинома Ньютона:

            $$ (a+b)^n = C_n^0 a^{n-0}b^0 + C_n^1 a^{n-1}b^1 + \ldots + C_n^n a^{n-n}b^n $$

            Используем символ суммы для того, чтобы записать эту формулу в коротком и красивом виде:

            $$ (a+b)^n = \sum\limits_{k=0}^n C_n^k a^{n-k}b^k $$

            $\blacksquare$

{ +toc }
@important
    title: Бином Ньютона
    main: |
        Формула, позволяющая напрямую получать результат возведения любого двучлена в любую натуральную степень:
    direction: row
    sections:
        proof: |
            Это пруф
        "Пункт а)": |
            Пункт А.
        "Пункт б)": |
            Пункт Б.
        "Пункт в)": |
            Пункт В.

@example
    title: Исследование на неубывание/строгое возрастание
    main: |
        Выяснить, являются ли следующие функции неубывающими или строго возрастающими:

        $$ \text{а) } f(x) = x >>{big} \text{б) } f(x) = 2 >>{big} \text{в) } f(x) = x^2 >>{big} \text{г) } f(x) = \sqrt{x} $$
    direction: row
    sections:
        "Пункт а)": |
            Берем две произвольные точки $x_1$ и $x_2$, такие что $x_1 < x_2$. Раз $f(x) = x$, то получаем следующую ситуацию:

            $$ x_1 = f(x_1) < x_2 = f(x_2) $$

            $$ f(x_1) < f(x_2) $$

            Это по определению означает, что функция $f(x) = x$ является строго возрастающей на всей своей области определения $(-\infty, +\infty)$.

        "Пункт б)": |
            Функция $f(x) = 2$ при любом $x$ равна $2$. Значит, для любых пар $x_1$ и $x_2$ вида $x_1 < x_2$ значения функции будут равны:

            $$ f(x_1) = f(x_2) = 2 $$

            Это по определению означает, что функция $f(x) = 2$ неубывает на всей области определения $(-\infty, +\infty)$.

        "Пункт в)": |
            Представляем график обычной параболы и замечаем, что функция $x^2$ не является возрастающей на всей своей области определения. Для доказательства этого достаточно взять $x_1 = -1$ и $x_2 = 0$. Найдем значения функции для этих точек:

            $$ f(x_1) = x_1^2 = (-1)^2 = 1 \\ f(x_2) = x_2^2 = 0^2 = 0 \\ f(x_1) > f(x_2) $$

            Итак, мы нашли такую пару точек, при которых значение функции уменьшилось. Значит, нельзя говорить, что $f(x) = x^2$ является неубывающей или строго возрастающей функцией на всей своей области определения $(-\infty, +\infty)$.

            Попробуем для этой же функции рассмотреть только неотрицательные $x$. Вновь возьмем произвольную пару уже неотрицательных чисел $0 \leq x_1 < x_2$. Попробуем доказать, что:

            $$ f(x_1) < f(x_2) \\ x_1^2 < x_2^2 \\ 0 < x_2^2 - x_1^2 \\ 0 < (x_2 - x_1)(x_2 + x_1) $$

            Первая скобка $x_2 - x_1$ будет положительной, так как по условию $x_1 < x_2$. Вторая скобка всегда положительная, так как в ней находится сумма двух положительных чисел. Произведение двух положительных чисел есть число
            положительное, поэтому последнее неравенство выполняется.

            Итак, мы по определению доказали, что квадратичная функция $x^2$ строго возрастает на полуинтервале $[0, +\infty)$.

        "Пункт г)": |
            Сразу напомню, что квадратный корень от отрицательных чисел мы взять не можем, поэтому областью определения функции $\sqrt{x}$ является все неотрицательные числа, то есть $[0, +\infty)$. Берем две произвольные точки $x_1 < x_2$ из этой области. Для строгой монотонности нам нужно доказать, что

            $$ f(x_1) < f(x_2) \\ \sqrt{x_1} < \sqrt{x_2} $$

            Выпишем последнее неравенство дважды. В первом обе части умножим на $\sqrt{x_1}$, во втором на $\sqrt{x_2}$:

            $$ \sqrt{x_1} < \sqrt{x_2} \ \qquad \ \sqrt{x_1} < \sqrt{x_2} \\ \sqrt{x_1}^2 < \sqrt{x_1}\sqrt{x_2} \ \qquad \ \sqrt{x_1}\sqrt{x_2} < \sqrt{x_2}^2 $$

            $$ \sqrt{x_1}^2 < \sqrt{x_1}\sqrt{x_2} < \sqrt{x_2}^2 \\ \sqrt{x_1}^2 < \sqrt{x_2}^2 \\ x_1 < x_2 $$

            Ну а последнее выполняется по условию, ведь мы как раз и взяли такие $x_1$ и $x_2$, что $x_1 < x_2$. Итак, мы по определению доказали, что функция $\sqrt{x}$ строго возрастает на всей своей области определения $[0, +\infty)$.

## Второй заголовок

Азазелло [это](page|summary) кек!\
А еще и ссылка на [практикум](page|practice)!

#### Foobar


$$ \sset $$

{ #foo }
<~ foo