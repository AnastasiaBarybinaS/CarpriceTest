$(function() {
        CarpricejsBtnProgress.init('form[name="feedbackForm"] [type="submit"]');

        var $form = $('form[name=feedbackForm]');
        var $formErrors = $('.js-feedback-errors');
        var $boxForm = $('.js-feedback-form');
        var $boxSuccess = $('.js-feedback-success');

        var fields = '[name="user_name"], [name="MESSAGE"], [name="user_email"], [name="captcha_word"]';

        $('#modalFeedback').on('show.bs.modal', function() {
            $boxForm.show();
            $boxSuccess.hide();
            $form.find(fields).val('').removeClass('error');
        });

        $form.on('change', fields, function() {
            $(this).toggleClass('error', !validateField(this));
            $(this).addClass('js-changed');
        }).on('keyup', fields, function() {
            if ($(this).hasClass('js-changed') && validateField(this)) {
                $(this).removeClass('error');
            }
        });

        function validateField(field) {
            switch (field.name) {
                case 'user_name':
                case 'MESSAGE':
                    return field.value.length >= 2;
                    break;
                case 'user_email':
                    return CarpricejsValidator().isEmail(field.value);
                    break;
                case 'captcha_word':
                    return field.value.length > 0;
                    break;
            }

            return true;
        }

        $('form[name="feedbackForm"] [type="submit"]').on('click', function(e) {

            e.preventDefault();

            var submit = this;
            var formValid = true;

            $.each($form.find(fields), function(i, field) {
                $(field).change();
                if (!validateField(field)) {
                    formValid = false;
                }
            });

            if (!formValid) {
                return false;
            }

            submit.jsProgress.start();

            $.post('/main/', $form.serialize(), function(result) {
                $boxForm.toggle(!result.success);
                $boxSuccess.toggle(result.success);
                $formErrors.html('');

                submit.jsProgress.stop();

                var captcha = result.captcha;

                if (captcha.code && captcha.img) {
                    $form.find('[name="captcha_sid"]').val(captcha.code);
                    $form.find('[name="captcha_word"]').val('');
                    $form.find('img.js-captcha-img').attr('src', captcha.img);
                }

                if (result.success) {
                    return false;
                }

                result.errors.forEach(function(error) {
                    $formErrors.append('<div class="errortext">' + error + '</div>');
                });
            }, 'json');

        })
    });